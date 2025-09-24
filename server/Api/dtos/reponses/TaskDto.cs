using DataAccess;

namespace App.dtos.reponses;

public class TaskDto
{
    public TaskDto(DataAccess.Task task)
    {
        TaskId = task.TaskId;
        BoardId = task.BoardId;
        Title = task.Title;
        Status = task.Status;
        CreatedAt = task.CreatedAt;
    }
    public int TaskId { get; set; }  
    public int BoardId { get; set; }  
    public string? Title { get; set; }  
    public string? Status { get; set; } 
    public DateTime? CreatedAt { get; set; } 
    

}