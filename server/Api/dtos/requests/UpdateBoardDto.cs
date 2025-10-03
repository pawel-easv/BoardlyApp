using System.ComponentModel.DataAnnotations;

namespace App.dtos.requests;

public class UpdateBoardDto
{
    [Required]
    public int BoardId { get; set; }
    
    public string Title { get; set; }
}