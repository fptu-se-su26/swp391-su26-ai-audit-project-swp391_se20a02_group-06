using FitnessTrainingSystem.Application.Common.Interfaces;
using FitnessTrainingSystem.Application.DTOs.Nutrition;
using FitnessTrainingSystem.Application.Interfaces;
using FitnessTrainingSystem.Domain.Entities;
using FitnessTrainingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FitnessTrainingSystem.Infrastructure.Services;

public class AIChatService : IAIChatService
{
    private readonly ApplicationDbContext _context;
    private readonly IGeminiAiService _geminiService;

    public AIChatService(
        ApplicationDbContext context,
        IGeminiAiService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }

    public async Task<AIChatResponse> SendMessageAsync(
        int userId,
        AIChatRequest request)
    {
        AIChatSession session;

        // lấy session
        if (request.SessionId.HasValue)
        {
            session = await _context.AIChatSessions
                .Include(x => x.Messages)
                .FirstOrDefaultAsync(
                    x => x.Id == request.SessionId.Value)
                ?? throw new Exception(
                    "Chat session not found.");
        }
        else
        {
            session = new AIChatSession
            {
                UserId = userId,
                Title = "Nutrition AI Chat",
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AIChatSessions.Add(session);

            await _context.SaveChangesAsync();
        }


        // lưu user message
        var userMessage = new AIChatMessage
        {
            SessionId = session.Id,
            Role = "user",
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.AIChatMessages.Add(userMessage);

        await _context.SaveChangesAsync();


        // lấy toàn bộ history
        var history = await _context.AIChatMessages
            .Where(x => x.SessionId == session.Id)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();


        var conversation = string.Join(
            "\n",
            history.Select(
                x => $"{x.Role}: {x.Message}")
        );


        // lấy thông tin user
        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == userId);


        var metric = await _context.BodyMetrics
            .Where(x => x.UserId == userId)
            .OrderByDescending(
                x => x.RecordedAt)
            .FirstOrDefaultAsync();


        // tạo user info gửi sang AI
        var userInfo = $@"
FullName: {user?.Fullname}
Gender: {user?.Gender}
Age: {(user?.DateOfBirth == null ? 0 : DateTime.Now.Year - user.DateOfBirth.Value.Year)}
Height: {metric?.Height}
Weight: {metric?.Weight}
";


        // gọi Python Chat API
        var aiReply = await _geminiService
            .ChatAsync(
                conversation,
                userInfo);


        // nếu đã đủ dữ liệu thì sinh thực đơn
        if (aiReply.Trim() == "READY_TO_GENERATE")
        {
            var dietPlan = await GenerateDietPlanAsync(
                session.Id);


            if (dietPlan != null)
            {
                await SaveDietPlanHistoryAsync(
                    userId,
                    session.Id,
                    dietPlan);


                return new AIChatResponse{

        SessionId=session.Id,

        Message="Đang tạo thực đơn dành cho bạn ...",

        Role="assistant",

        DietPlan=dietPlan,

        IsCompleted=true

};
            }
        }


        // lưu assistant message
        var aiMessage = new AIChatMessage
        {
            SessionId = session.Id,
            Role = "assistant",
            Message = aiReply,
            CreatedAt = DateTime.UtcNow
        };

        _context.AIChatMessages.Add(aiMessage);

        await _context.SaveChangesAsync();


        return new AIChatResponse
        {
        SessionId=session.Id,

        Message=aiReply,

        Role="assistant",

        IsCompleted=false
        };
    }


    public async Task<List<AIChatResponse>>
        GetMessagesAsync(int sessionId)
    {
        var messages = await _context.AIChatMessages
            .Where(x => x.SessionId == sessionId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();

        var dietHistory = await _context.AIDietHistories
            .FirstOrDefaultAsync(x => x.SessionId == sessionId);

        DietPlanResponse? dietPlan = null;
        if (dietHistory != null)
        {
            try
            {
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                dietPlan = System.Text.Json.JsonSerializer
                    .Deserialize<DietPlanResponse>(dietHistory.DietJson, options);
            }
            catch
            {
                // Ignore deserialize errors
            }
        }

        var results = messages.Select(x => new AIChatResponse
        {
            SessionId = x.SessionId,
            Message = x.Message,
            Role = x.Role,
            IsCompleted = dietHistory != null,
            DietPlan = null
        }).ToList();

        if (results.Count > 0 && dietPlan != null)
        {
            results.Last().DietPlan = dietPlan;
            results.Last().IsCompleted = true;
        }

        return results;
    }


    public async Task<DietPlanResponse?>
        GenerateDietPlanAsync(int sessionId)
    {
        var session = await _context.AIChatSessions
            .Include(x => x.Messages)
            .FirstOrDefaultAsync(
                x => x.Id == sessionId);


        if (session == null)
            return null;


        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == session.UserId);


        var metric = await _context.BodyMetrics
            .Where(x => x.UserId == session.UserId)
            .OrderByDescending(
                x => x.RecordedAt)
            .FirstOrDefaultAsync();


        if (user == null || metric == null)
            return null;


        var foods = await _context.Foods
            .ToListAsync();


        var foodJson =
            System.Text.Json.JsonSerializer.Serialize(

            foods.Select(x => new
            {
                food_id = x.Id,
                food_name = x.Name,
                calories = x.Calories,
                protein = x.Protein,
                carbs = x.Carbs,
                fat = x.Fat
            }));


        var history = string.Join(
            "\n",
            session.Messages
            .OrderBy(x => x.CreatedAt)
            .Select(x =>
                $"{x.Role}: {x.Message}")
        );


        var userInfo = $@"
FullName: {user.Fullname}
Gender: {user.Gender}
Age: {(user.DateOfBirth == null ? 0 : DateTime.Now.Year - user.DateOfBirth.Value.Year)}
Height: {metric.Height}
Weight: {metric.Weight}

Conversation:
{history}
";


        return await _geminiService
            .GenerateDietPlanAsync(
                userInfo,
                foodJson);
    }


    public async Task SaveDietPlanHistoryAsync(
        int userId,
        int sessionId,
        DietPlanResponse response)
    {
        var entity = new AIDietHistory
        {
            UserId = userId,
            SessionId = sessionId,
            DietTitle = response.DietTitle ?? "AI Diet Plan",
            TotalCalories = response.DailyCalories,
            Protein = response.ProteinTargetG,
            Carbs = response.CarbsTargetG,
            Fat = response.FatTargetG,
            DietJson =
                System.Text.Json.JsonSerializer
                .Serialize(response),

            CreatedAt = DateTime.UtcNow
        };


        _context.AIDietHistories
            .Add(entity);

        await _context.SaveChangesAsync();
    }
}