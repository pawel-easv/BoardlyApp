using System.ComponentModel.DataAnnotations;
using api.Services;
using App.dtos.reponses;
using App.dtos.requests;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

public class BoardService : IBoardService
{
    private readonly MyDbContext _ctx;

    public BoardService(MyDbContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<BoardDto> CreateBoard(CreateBoardDto dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var board = new Board
        {
            Title = dto.Title,
            Description = dto.Description,
            CreatedAt = DateTime.Now
        };

        _ctx.Boards.Add(board);
        await _ctx.SaveChangesAsync();

        return new BoardDto(board);
    }

    public async Task<List<BoardDto>> GetAllBoards(int userId)
    {
        return await _ctx.UserBoards
            .Where(ub => ub.UserId == userId)
            .Include(ub => ub.Board)
            .ThenInclude(b => b.Tasks)
            .Select(ub => new BoardDto(ub.Board))
            .ToListAsync();
    }

    public async Task<List<TaskDto>> GetAllTasksForBoard(int boardId)
    {
        return await _ctx.Tasks
            .Where(ub => ub.BoardId == boardId)
            .Select(ub => new TaskDto(ub))
            .ToListAsync();
    }

    public async Task<TaskDto> CreateTask(CreateTaskDto dto)
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
        await _ctx.SaveChangesAsync();

        return new TaskDto(task);
    }

    public async Task<TaskDto> UpdateTask(UpdateTaskDto dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var task = await _ctx.Tasks.FirstOrDefaultAsync(t => t.TaskId == dto.TaskId);
        if (task == null)
            throw new InvalidOperationException($"Task with ID {dto.TaskId} not found.");

        task.Title = dto.Title;
        task.Status = dto.Status;
        await _ctx.SaveChangesAsync();

        return new TaskDto(task);
    }
    
    public async Task<TaskDto> DeleteTask(int id)
    {
        var task = _ctx.Tasks.First(t => t.TaskId == id);
        _ctx.Tasks.Remove(task);
        await _ctx.SaveChangesAsync();
        return new TaskDto(task);
    }
}