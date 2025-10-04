using System.ComponentModel.DataAnnotations;

namespace App.dtos.requests;

public class CreateTaskDto
{
    [Required]
    public int BoardId { get; set; }
    
    [Required] [MinLength(3)]
    public string Title { get; set; }
    
    public string? Status { get; set; }
}