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
    private readonly IGroqNutritionAiService _aiService;

    public AIChatService(
        ApplicationDbContext context,
        IGroqNutritionAiService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<AIChatResponse> SendMessageAsync(int userId, AIChatRequest request)
    {
        AIChatSession session;

        if (request.SessionId.HasValue)
        {
            session = await _context.AIChatSessions
                .Include(x => x.Messages)
                .FirstOrDefaultAsync(x => x.Id == request.SessionId.Value)
                ?? throw new Exception("Chat session not found.");
                
            if (session.UserId != userId) 
                throw new UnauthorizedAccessException("Not your session.");
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

        // 2. Lưu tin nhắn của User vào Database
        var userMessage = new AIChatMessage
        {
            SessionId = session.Id,
            Role = "user",
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.AIChatMessages.Add(userMessage);
        await _context.SaveChangesAsync();

        // 3. Lấy tối đa 6 tin nhắn gần nhất để làm ngữ cảnh (giảm token)
        var history = await _context.AIChatMessages
            .Where(x => x.SessionId == session.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Take(6)
            .ToListAsync();

        history.Reverse(); // Đảo lại thứ tự thời gian tăng dần

        var conversation = string.Join("\n", history.Select(x => $"{x.Role}: {x.Message}"));

        // 4. Lấy thông tin cơ bản của User
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        var metric = await _context.BodyMetrics
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync();

        // Tính tuổi chính xác hơn
        int age = user?.DateOfBirth == null 
            ? 25 
            : (int)((DateTime.UtcNow - user.DateOfBirth.Value).TotalDays / 365.25);

        var userInfo = $@"
FullName: {user?.Fullname ?? "Hội viên"}
Gender: {user?.Gender ?? "Nam"}
Age: {age}
Height: {metric?.Height ?? 170}
Weight: {metric?.Weight ?? 65}
";

        // 5. Gọi sang dịch vụ Python xử lý chat
        string aiReply;
        try
        {
            aiReply = await _aiService.ChatAsync(conversation, userInfo);
        }
        catch (Exception ex)
        {
            Console.WriteLine("================ [PYTHON CHAT API CRASH] ================");
            Console.WriteLine($"Lỗi kết nối hoặc xử lý từ API Python: {ex.Message}");
            Console.WriteLine("=========================================================");
            
            aiReply = "Xin lỗi bạn, kết nối với trí tuệ nhân tạo đang bị gián đoạn một chút. Bạn có thể thử gửi lại tin nhắn vừa rồi không?";
        }
        
        string finalReplyToSave = aiReply;

        // 6. KIỂM TRA ĐIỀU KIỆN SINH THỰC ĐƠN
        if (aiReply.Contains("READY_TO_GENERATE", StringComparison.OrdinalIgnoreCase))
        {
            var dietPlan = await GenerateDietPlanAsync(session.Id);

            if (dietPlan != null)
            {
                await SaveDietPlanHistoryAsync(userId, session.Id, dietPlan);

                finalReplyToSave = "Tôi đã thu thập đủ thông tin cần thiết. Thực đơn dinh dưỡng cá nhân hóa của bạn đã được tạo thành công!";

                var aiFinalMessage = new AIChatMessage
                {
                    SessionId = session.Id,
                    Role = "ai",
                    Message = finalReplyToSave,
                    CreatedAt = DateTime.UtcNow
                };
                _context.AIChatMessages.Add(aiFinalMessage);
                await _context.SaveChangesAsync();

                return new AIChatResponse
                {
                    SessionId = session.Id,
                    Message = finalReplyToSave,
                    Role = "ai",
                    DietPlan = dietPlan,
                    IsCompleted = true
                };
            }
            else
            {
                finalReplyToSave = "Tôi đã có đủ thông tin của bạn, tuy nhiên hệ thống gặp sự cố khi trích xuất dữ liệu món ăn. Bạn vui lòng thử lại sau ít phút.";
            }
        }

        // 7. Lưu tin nhắn hội thoại bình thường của Assistant (Nếu không tạo thực đơn hoặc tạo thất bại)
        var aiMessage = new AIChatMessage
        {
            SessionId = session.Id,
            Role = "ai",
            Message = finalReplyToSave,
            CreatedAt = DateTime.UtcNow
        };

        _context.AIChatMessages.Add(aiMessage);
        await _context.SaveChangesAsync();

        return new AIChatResponse
        {
            SessionId = session.Id,
            Message = finalReplyToSave,
            Role = "ai",
            IsCompleted = false
        };
    }


    public async Task<List<AIChatResponse>> GetMessagesAsync(int userId, int sessionId)
    {
        var session = await _context.AIChatSessions.FirstOrDefaultAsync(x => x.Id == sessionId);
        if (session == null || session.UserId != userId)
            throw new UnauthorizedAccessException("Not your session.");

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


    public async Task<DietPlanResponse?> GenerateDietPlanAsync(int sessionId)
    {
        var session = await _context.AIChatSessions
            .Include(x => x.Messages)
            .FirstOrDefaultAsync(x => x.Id == sessionId);

        if (session == null)
            return null;

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == session.UserId);
        var metric = await _context.BodyMetrics
            .Where(x => x.UserId == session.UserId)
            .OrderByDescending(x => x.RecordedAt)
            .FirstOrDefaultAsync();

        if (user == null) 
        {
            user = new User { Fullname = "Hội viên", Gender = "Nam" };
        }
        if (metric == null)
        {
            metric = new BodyMetric { Height = 170, Weight = 65 };
        }

        var foods = await _context.Foods
            .AsNoTracking()
            .Select(x => new { x.Id, x.Name, x.Calories, x.Protein, x.Carbs, x.Fat })
            .Take(100)
            .ToListAsync();

        var foodLines = foods.Select(x => $"{x.Id},{x.Name},{x.Calories},{x.Protein},{x.Carbs},{x.Fat}");
        var foodJson = string.Join("\n", foodLines);

        var historyMessages = session.Messages
            .OrderByDescending(x => x.CreatedAt)
            .Take(10)
            .Reverse()
            .ToList();

        var history = string.Join(
            "\n",
            historyMessages.Select(x => $"{x.Role}: {x.Message}")
        );

        int age = user.DateOfBirth == null 
            ? 25 
            : (int)((DateTime.UtcNow - user.DateOfBirth.Value).TotalDays / 365.25);

        var userInfo = $@"
FullName: {user.Fullname}
Gender: {user.Gender}
Age: {age}
Height: {metric.Height}
Weight: {metric.Weight}

Conversation:
{history}
";

        try 
        {
            var planResult = await _aiService.GenerateDietPlanAsync(userInfo, foodJson);
            if (planResult == null)
            {
                Console.WriteLine("================ [DIET PLAN LỖI] ================");
                Console.WriteLine("Python tiếp nhận dữ liệu thành công nhưng trả về Object Null.");
                Console.WriteLine("=================================================");
            }
            return planResult;
        }
        catch (Exception ex)
        {
            Console.WriteLine("================ [DIET PLAN CRASH] ================");
            Console.WriteLine($"Message: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            if (ex.InnerException != null) 
            {
                Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
            }
            Console.WriteLine("===================================================");
            return null;
        }
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
            TotalCalories = (int)response.DailyCalories,
            Protein = (int)response.ProteinTargetG,
            Carbs = (int)response.CarbsTargetG,
            Fat = (int)response.FatTargetG,
            DietJson = System.Text.Json.JsonSerializer.Serialize(response),
            CreatedAt = DateTime.UtcNow
        };

        _context.AIDietHistories.Add(entity);
        await _context.SaveChangesAsync(); // Save to ensure transaction ordering

        // TÍCH HỢP VÀO MEAL SCHEDULE (DATABASE CÓ SẴN)
        var mealSchedule = new MealSchedule
        {
            UserId = userId,
            ScheduleName = response.DietTitle ?? "AI Diet Plan",
            TotalCaloriesTarget = (int)response.DailyCalories,
            CreatedAt = DateTime.UtcNow
        };

        _context.MealSchedules.Add(mealSchedule);
        await _context.SaveChangesAsync(); // Get the new MealSchedule.Id

        var mealScheduleItems = new List<MealScheduleItem>();
        
        if (response.Meals != null)
        {
            foreach (var meal in response.Meals)
            {
                if (meal.Foods != null)
                {
                    foreach (var food in meal.Foods)
                    {
                        var item = new MealScheduleItem
                        {
                            MealScheduleId = mealSchedule.Id,
                            FoodId = int.Parse(food.FoodId ?? "0"),
                            // Kết hợp Tên Bữa Ăn và Khối lượng để UI dễ hiển thị sau này (ví dụ: "Breakfast: 100g")
                            Amount = $"{meal.Name} - {food.Amount}",
                            IsEaten = false,
                            CreatedAt = DateTime.UtcNow
                        };
                        mealScheduleItems.Add(item);
                    }
                }
            }
        }

        _context.MealScheduleItems.AddRange(mealScheduleItems);
        await _context.SaveChangesAsync();
    }

    public async Task<List<AIDietHistoryDto>> GetDietHistoriesAsync(int userId)
    {
        var histories = await _context.AIDietHistories
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return histories.Select(x => {
            DietPlanResponse? dietPlan = null;
            try
            {
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                dietPlan = System.Text.Json.JsonSerializer.Deserialize<DietPlanResponse>(x.DietJson, options);
            }
            catch
            {
                // ignore
            }

            return new AIDietHistoryDto
            {
                Id = x.Id,
                SessionId = x.SessionId,
                DietTitle = x.DietTitle,
                TotalCalories = x.TotalCalories,
                Protein = x.Protein,
                Carbs = x.Carbs,
                Fat = x.Fat,
                DietPlan = dietPlan,
                CreatedAt = x.CreatedAt
            };
        }).ToList();
    }
}