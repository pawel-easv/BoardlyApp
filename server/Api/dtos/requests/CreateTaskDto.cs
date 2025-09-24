using System.ComponentModel.DataAnnotations;

namespace App.dtos.requests;

public class CreateTaskDto
{
    [Required]
    public int BoardId { get; set; }
    
    public string Title { get; set; }
    
    public string? Status { get; set; }
}