using System.ComponentModel.DataAnnotations;

namespace App.dtos.requests;

public class CreateBoardDto
{
    [MinLength(3)] [Required] public string Title { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    public string? Description { get; set; }
}