using System.ComponentModel.DataAnnotations;
using App.dtos.reponses;
using App.dtos.requests;
using DataAccess;
using Microsoft.EntityFrameworkCore;

public class BoardService
{
    private readonly MyDbContext _ctx;

    public BoardService(MyDbContext ctx)
    {
        _ctx = ctx;
    }

    public BoardDto CreateBoard(CreateBoardDto dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var board = new Board
        {
            Title = dto.Title,
            Description = dto.Description,
            CreatedAt = DateTime.Now
        };
        _ctx.Boards.Add(board);
        _ctx.SaveChanges();
        return new BoardDto(board);
    }

    public List<BoardDto> GetAllBoards(int userId)
    {
        return _ctx.UserBoards
            .Where(ub => ub.UserId == userId)
            .Include(ub => ub.Board)
            .ThenInclude(b => b.Tasks)
            .Select(ub => new BoardDto(ub.Board))
            .ToList();
    }

    public TaskDto CreateTask(CreateTaskDto dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var task = new DataAccess.Task
        {
            BoardId = dto.BoardId,
            Title = dto.Title,
            Status = dto.Status,
            CreatedAt = DateTime.Now
        };
        
        _ctx.Tasks.Add(task);
        _ctx.SaveChanges();
        return new TaskDto(task);
    }
    
    public TaskDto UpdateTask(UpdateTaskDto dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var task = _ctx.Tasks.FirstOrDefault(t => t.TaskId == dto.TaskId);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {dto.TaskId} not found.");

        task.Title = dto.Title;
        task.Status = dto.Status;
        _ctx.SaveChanges();
        
        return new TaskDto(task);
    }
}