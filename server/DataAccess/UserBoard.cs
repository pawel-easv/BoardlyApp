using System;
using System.Collections.Generic;

namespace DataAccess;

public partial class UserBoard
{
    public int UserId { get; set; }

    public int BoardId { get; set; }

    public string? Role { get; set; }

    public virtual Board Board { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
