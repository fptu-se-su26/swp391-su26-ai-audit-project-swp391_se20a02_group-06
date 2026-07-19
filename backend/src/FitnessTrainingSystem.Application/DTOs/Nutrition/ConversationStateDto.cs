public class ConversationStateDto
{
    public string? Allergies { get; set; }

    public string? DislikedFoods { get; set; }

    public string? PreferredFoods { get; set; }

    public int? MealCount { get; set; }

    public string? Diseases { get; set; }

    public string? CookingPreference { get; set; }

    public decimal? Budget { get; set; }

    public int? TargetCalories { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; } = false;
}