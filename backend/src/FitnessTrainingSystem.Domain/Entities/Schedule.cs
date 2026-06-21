using FitnessTrainingSystem.Domain.Common;
using FitnessTrainingSystem.Domain.Enums;

namespace FitnessTrainingSystem.Domain.Entities;

public class Schedule : BaseEntity
{
    public int? PtId { get; set; }
    public int? MemberId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public ScheduleStatus Status { get; set; } = ScheduleStatus.Pending;
    public string? MeetingUrl { get; set; }

    public User? Pt { get; set; }
    public User? Member { get; set; }
}
