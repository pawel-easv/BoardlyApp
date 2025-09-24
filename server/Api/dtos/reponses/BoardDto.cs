using DataAccess;

namespace App.dtos.reponses;

public class BoardDto
{
    public BoardDto(Board entity)
    {
        this.BoardId = entity.BoardId;
        this.Title = entity.Title;
        this.Description = entity.Description;
        this.CreatedAt = entity.CreatedAt;
        this.Tasks = entity.Tasks.Select(t => new TaskDto(t)).ToList();
    }
    public int BoardId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public ICollection<TaskDto> Tasks { get; set; } = new List<TaskDto>();
}