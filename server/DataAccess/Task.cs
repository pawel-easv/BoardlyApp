using System;
using System.Collections.Generic;

namespace DataAccess;

public partial class Task
{
    public int TaskId { get; set; }

    public int BoardId { get; set; }

    public string? Status { get; set; }

    public string? Title { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Board Board { get; set; } = null!;
}
