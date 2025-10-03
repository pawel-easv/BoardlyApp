using api.Services;
using App.dtos.reponses;
using App.dtos.requests;
using Microsoft.AspNetCore.Mvc;

namespace api;

public class BoardsController(IBoardService _service) : ControllerBase
{
    [HttpPost(nameof(CreateBoard))]
    public async Task<BoardDto> CreateBoard([FromBody] CreateBoardDto dto)
    {
        return await _service.CreateBoard(dto);
    }

    [HttpPost(nameof(CreateTask))]
    public Task<TaskDto> CreateTask([FromBody] CreateTaskDto dto)
    {
        return _service.CreateTask(dto);
    }

    [HttpPut(nameof(UpdateTask))]
    public Task<TaskDto> UpdateTask([FromBody] UpdateTaskDto dto)
    {
        return _service.UpdateTask(dto);
    }
    
    [HttpPut(nameof(UpdateBoard))]
    public Task<BoardDto> UpdateBoard([FromBody] UpdateBoardDto dto)
    {
        return _service.UpdateBoard(dto);
    }

    [HttpGet(nameof(GetAllBoards))]
    public Task<List<BoardDto>> GetAllBoards([FromQuery] int userId)
    {
        return _service.GetAllBoards(userId);
    }
    
    [HttpGet(nameof(GetAllTasksForBoard))]
    public Task<List<TaskDto>> GetAllTasksForBoard([FromQuery] int boardId)
    {
        return _service.GetAllTasksForBoard(boardId);
    }
    
    [HttpDelete(nameof(DeleteTask))]
    public Task<TaskDto> DeleteTask([FromQuery] int taskId)
    {
        return _service.DeleteTask(taskId);
    }
}