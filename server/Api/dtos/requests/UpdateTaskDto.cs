using System.ComponentModel.DataAnnotations;

namespace App.dtos.requests;

public class UpdateTaskDto
{
    [Required]
    public int TaskId { get; set; }
    
    public string Title { get; set; }
    
    public string Status { get; set; }
    
    
}