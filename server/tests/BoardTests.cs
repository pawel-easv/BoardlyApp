using System.ComponentModel.DataAnnotations;
using App.dtos.requests;
using Task = System.Threading.Tasks.Task;
using DataAccess;

namespace tests;

public class BoardTests(BoardService service, MyDbContext ctx)
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
        Assert.Equal(0, ctx.Boards.Count());

        var dto = new CreateBoardDto
        {
            Title = "New Board"
        };
        var result = await service.CreateBoard(dto);
        
        Assert.Equal(1, ctx.Boards.Count());
        Assert.True(result.Title.Length >= 3);
    }
    
    [Fact]
    public async Task UpdateBoard_ShouldUpdateBoardAndReturn()
    {
        var board = new Board
        {
            Title = "Initial Title",
        };
        ctx.Boards.Add(board);
        await ctx.SaveChangesAsync();

        var updateDto = new UpdateBoardDto
        {
            BoardId = board.BoardId,
            Title = "Updated Title",
        };

        var updatedBoard = await service.UpdateBoard(updateDto);

        Assert.Equal(board.BoardId, updatedBoard.BoardId);
        Assert.Equal("Updated Title", updatedBoard.Title);

        var dbBoard = ctx.Boards.First(b => b.BoardId == board.BoardId);
        Assert.Equal("Updated Title", dbBoard.Title);
    }

    

}
