using System.ComponentModel.DataAnnotations;
using api.Services;
using App.dtos.requests;
using Task = System.Threading.Tasks.Task;
using DataAccess;

namespace tests;

public class BoardTests(IBoardService service, MyDbContext ctx)
{
    [Fact]
    public async Task CreateBoard_ShouldThrowExceptionWhenDataValidationFails()
    {
        Assert.Equal(0, ctx.Boards.Count());

        var dto = new CreateBoardDto
        {
            Title = ""
        };
    
        await Assert.ThrowsAnyAsync<ValidationException>(() => service.CreateBoard(dto));
    }

    [Fact]
    public async Task CreateBoard_ShouldCreateBoardAndReturn()
    {
        var testUser = new User
        {
            Username = "testuser",
            Email = "test@example.com",
            PasswordHash = "" + Guid.NewGuid(),
            UserId = 1
            
        };
        ctx.Users.Add(testUser);
        await ctx.SaveChangesAsync();

        Assert.Equal(0, ctx.Boards.Count());

        var dto = new CreateBoardDto
        {
            Title = "New Board",
            UserId = testUser.UserId 
        };
    
        var result = await service.CreateBoard(dto);
    
        Assert.Equal(1, ctx.Boards.Count());
        Assert.Equal(1, ctx.UserBoards.Count());
        Assert.True(result.Title.Length >= 3);
    }
    
    [Fact]
    public async Task UpdateBoard_ShouldUpdateBoardAndReturn()
    {
        Assert.Equal(0, ctx.Boards.Count());
        var board = new Board
        {
            Title = "Initial Title",
        };
        ctx.Boards.Add(board);
        await ctx.SaveChangesAsync();
        Assert.Equal(1, ctx.Boards.Count());

        var updateDto = new UpdateBoardDto
        {
            BoardId = board.BoardId,
            Title = "Updated Title",
        };

        var updatedBoard = await service.UpdateBoard(updateDto);
        
        Assert.Equal(1, ctx.Boards.Count());
        Assert.Equal(board.BoardId, updatedBoard.BoardId);
        Assert.Equal("Updated Title", updatedBoard.Title);

        var dbBoard = ctx.Boards.First(b => b.BoardId == board.BoardId);
        Assert.Equal("Updated Title", dbBoard.Title);
    }

    [Fact]
    public async Task DeleteBoard_ShouldThrowExceptionWhenBoardNotFound()
    {
        var nonExistentBoardId = -1;

        await Assert.ThrowsAnyAsync<InvalidOperationException>(() => service.DeleteBoard(nonExistentBoardId));
    }

    [Fact]
    public async Task DeleteBoard_ShouldDeleteBoardAndReturn()
    {
        Assert.Equal(0, ctx.Boards.Count());
        var board = new Board
        {
            Title = "Initial Title",
            BoardId = 1
        };
        ctx.Boards.Add(board);
        await ctx.SaveChangesAsync();
        Assert.Equal(1, ctx.Boards.Count());
        await service.DeleteBoard(1);
        await ctx.SaveChangesAsync();
        
        Assert.Equal(0, ctx.Boards.Count());
    }
    

}
