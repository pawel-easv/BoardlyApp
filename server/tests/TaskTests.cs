using System.ComponentModel.DataAnnotations;
using api.Services;
using App.dtos.requests;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace tests;

public class TaskTests(IBoardService service, MyDbContext ctx)
{
    private async Task<Board> CreateBoardAsync()
    {
        var board = new Board { Title = "Test Board" };
        ctx.Boards.Add(board);
        await ctx.SaveChangesAsync();
        return board;
    }

    [Fact]
    public async Task CreateTask_ShouldThrowExceptionWhenValidationFails()
    {
        var board = await CreateBoardAsync();

        var dto = new CreateTaskDto
        {
            Title = "", 
            BoardId = board.BoardId,
            Status = "Pending"
        };

        await Assert.ThrowsAnyAsync<ValidationException>(() => service.CreateTask(dto));
    }

    [Fact]
    public async Task CreateTask_ShouldCreateTaskAndReturn()
    {
        var board = await CreateBoardAsync();

        var dto = new CreateTaskDto
        {
            Title = "New Task",
            BoardId = board.BoardId,
            Status = "Pending"
        };

        var result = await service.CreateTask(dto);

        Assert.Equal(1, ctx.Tasks.Count());
        Assert.Equal("New Task", result.Title);
        Assert.Equal(board.BoardId, result.BoardId);
    }

    [Fact]
    public async Task UpdateTask_ShouldUpdateTaskAndReturn()
    {
        var board = await CreateBoardAsync();

        var task = new DataAccess.Task
        {
            BoardId = board.BoardId,
            Title = "Initial Task",
            Status = "Pending"
        };
        ctx.Tasks.Add(task);
        await ctx.SaveChangesAsync();

        var dto = new UpdateTaskDto
        {
            TaskId = task.TaskId,
            Title = "Updated Task",
            Status = "Done"
        };

        var result = await service.UpdateTask(dto);

        Assert.Equal(task.TaskId, result.TaskId);
        Assert.Equal("Updated Task", result.Title);
        Assert.Equal("Done", result.Status);

        var dbTask = ctx.Tasks.First(t => t.TaskId == task.TaskId);
        Assert.Equal("Updated Task", dbTask.Title);
    }

    [Fact]
    public async Task DeleteTask_ShouldRemoveTask()
    {
        var board = await CreateBoardAsync();

        var task = new DataAccess.Task
        {
            BoardId = board.BoardId,
            Title = "Task to Delete",
            Status = "Pending"
        };
        ctx.Tasks.Add(task);
        await ctx.SaveChangesAsync();

        Assert.Equal(1, ctx.Tasks.Count());

        var result = await service.DeleteTask(task.TaskId);

        Assert.Equal("Task to Delete", result.Title);
        Assert.Equal(0, ctx.Tasks.Count());
    }

    [Fact]
    public async Task GetAllTasksForBoard_ShouldReturnTasksForBoard()
    {
        var board = await CreateBoardAsync();

        ctx.Tasks.AddRange(
            new DataAccess.Task { Title = "Task A", BoardId = board.BoardId, Status = "Pending" },
            new DataAccess.Task { Title = "Task B", BoardId = board.BoardId, Status = "Done" }
        );
        await ctx.SaveChangesAsync();

        var tasks = await service.GetAllTasksForBoard(board.BoardId);

        Assert.Equal(2, tasks.Count);
        Assert.Contains(tasks, t => t.Title == "Task A");
        Assert.Contains(tasks, t => t.Title == "Task B");
    }

    [Fact]
    public async Task DeleteAllTasksForBoard_ShouldReturnTasksForBoard()
    {
        var board1 = await CreateBoardAsync();
        
        var board2 = await CreateBoardAsync();
        
        ctx.Tasks.AddRange(
            new DataAccess.Task { Title = "Task A", BoardId = board1.BoardId, Status = "Pending" },
            new DataAccess.Task { Title = "Task B", BoardId = board1.BoardId, Status = "Done" },
            new DataAccess.Task { Title = "Task C", BoardId = board2.BoardId, Status = "Done" }
            
        );
        await ctx.SaveChangesAsync();
        Assert.Equal(3, ctx.Tasks.Count());
        
        await service.DeleteAllTasksForBoard(board1.BoardId);
        
        Assert.Equal(1, ctx.Tasks.Count());
        Assert.All(ctx.Tasks, t => Assert.Equal(board2.BoardId, t.BoardId));
    }
    
    [Fact]
    public async Task DeleteAllTasksForBoard_ShouldThrowException_WhenBoardNotFound()
    {
        var nonExistentBoardId = -1;
        
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.DeleteAllTasksForBoard(nonExistentBoardId));
    }
}
