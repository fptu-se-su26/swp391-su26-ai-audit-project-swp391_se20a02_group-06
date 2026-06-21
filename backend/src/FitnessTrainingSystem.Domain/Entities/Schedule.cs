using System;
using System.Collections.Generic;

namespace FitnessTrainingSystem.Domain.Entities;

public partial class Schedule
{
    public int Id { get; set; }

    public int PtId { get; set; }

    public int MemberId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string? Status { get; set; }

    public string? MeetingUrl { get; set; }

    public string? Note { get; set; }

    public string? CancelReason { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User Member { get; set; } = null!;

    public virtual User Pt { get; set; } = null!;
}
