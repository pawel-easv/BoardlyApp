using System;
using System.Collections.Generic;

namespace DataAccess;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public virtual ICollection<UserBoard> UserBoards { get; set; } = new List<UserBoard>();
}
