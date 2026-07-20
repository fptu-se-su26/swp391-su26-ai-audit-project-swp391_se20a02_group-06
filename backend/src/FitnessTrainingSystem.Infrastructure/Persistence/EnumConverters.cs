using FitnessTrainingSystem.Domain.Enums;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FitnessTrainingSystem.Infrastructure.Persistence;

/// <summary>
/// Maps RecommendationType enum to DB SCREAMING_SNAKE_CASE enum strings.
/// C# WorkoutPlan  <-> DB "WORKOUT_PLAN"
/// C# NutritionDiet <-> DB "NUTRITION_DIET"
/// </summary>
public class RecommendationTypeConverter : ValueConverter<RecommendationType, string>
{
    public RecommendationTypeConverter() : base(
        v => v == RecommendationType.WorkoutPlan ? "WORKOUT_PLAN" : "NUTRITION_DIET",
        v => v == "WORKOUT_PLAN" ? RecommendationType.WorkoutPlan : RecommendationType.NutritionDiet)
    { }
}

/// <summary>
/// Maps ExerciseDifficulty enum to DB uppercase strings.
/// C# Beginner <-> DB "BEGINNER", Intermediate <-> "INTERMEDIATE", Advanced <-> "ADVANCED"
/// </summary>
public class ExerciseDifficultyConverter : ValueConverter<ExerciseDifficulty, string>
{
    public ExerciseDifficultyConverter() : base(
        v => v.ToString().ToUpperInvariant(),
        v => v == "INTERMEDIATE" ? ExerciseDifficulty.Intermediate
           : v == "ADVANCED"     ? ExerciseDifficulty.Advanced
           : ExerciseDifficulty.Beginner)
    { }
}

/// <summary>
/// Maps PackageType enum to DB uppercase enum strings.
/// C# Membership <-> DB "MEMBERSHIP"
/// C# OnlineWorkout <-> DB "ONLINE_WORKOUT"
/// C# VIP <-> DB "VIP"
/// </summary>
public class PackageTypeConverter : ValueConverter<PackageType, string>
{
    public PackageTypeConverter() : base(
        v => v == PackageType.OnlineWorkout ? "ONLINE_WORKOUT"
           : v == PackageType.VIP          ? "VIP"
           : "MEMBERSHIP",
        v => v == "ONLINE_WORKOUT" ? PackageType.OnlineWorkout
           : v == "VIP"           ? PackageType.VIP
           : PackageType.Membership)
    { }
}

/// <summary>
/// Maps ScheduleStatus enum to DB uppercase enum strings.
/// C# Pending <-> DB "PENDING", Confirmed <-> "CONFIRMED", etc.
/// </summary>
public class ScheduleStatusConverter : ValueConverter<ScheduleStatus, string>
{
    public ScheduleStatusConverter() : base(
        v => v.ToString().ToUpperInvariant(),
        v => v == "CONFIRMED" ? ScheduleStatus.Confirmed
           : v == "COMPLETED" ? ScheduleStatus.Completed
           : v == "CANCELLED" ? ScheduleStatus.Cancelled
           : ScheduleStatus.Pending)
    { }
}

/// <summary>
/// Maps PaymentStatus enum to DB uppercase enum strings.
/// C# Pending <-> DB "PENDING", Paid <-> "PAID", Cancelled <-> "CANCELLED"
/// </summary>
public class PaymentStatusConverter : ValueConverter<PaymentStatus, string>
{
    public PaymentStatusConverter() : base(
        v => v == PaymentStatus.Paid      ? "PAID"
           : v == PaymentStatus.Cancelled ? "CANCELLED"
           : "PENDING",
        v => v == "PAID"      ? PaymentStatus.Paid
           : v == "CANCELLED" ? PaymentStatus.Cancelled
           : PaymentStatus.Pending)
    { }
}
