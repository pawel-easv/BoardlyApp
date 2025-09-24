using System;
using System.Collections.Generic;

namespace DataAccess;

public partial class Board
{
    public int BoardId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

    public virtual ICollection<UserBoard> UserBoards { get; set; } = new List<UserBoard>();
}
