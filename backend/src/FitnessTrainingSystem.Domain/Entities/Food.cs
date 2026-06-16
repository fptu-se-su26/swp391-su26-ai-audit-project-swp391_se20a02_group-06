using FitnessTrainingSystem.Domain.Common;

namespace FitnessTrainingSystem.Domain.Entities;

public class Food : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Calories { get; set; }
    public decimal Protein { get; set; } = 0.0m;
    public decimal Carbs { get; set; } = 0.0m;
    public decimal Fat { get; set; } = 0.0m;

    public ICollection<Menu> Menus { get; set; } = new List<Menu>();
}
