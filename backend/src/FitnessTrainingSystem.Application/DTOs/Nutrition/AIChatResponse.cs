using FitnessTrainingSystem.Application.DTOs.Nutrition;

public class AIChatResponse
{

    public int SessionId {get;set;}

    public string Message {get;set;}
        =string.Empty;


    public string Role {get;set;}
        =string.Empty;


    public bool IsCompleted {get;set;}


    public DietPlanResponse? DietPlan
        {get;set;}

}