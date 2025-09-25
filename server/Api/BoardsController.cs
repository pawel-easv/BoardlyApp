using api.Services;
using App.dtos.reponses;
using App.dtos.requests;
using Microsoft.AspNetCore.Mvc;

namespace api;

public class BoardsController(IBoardService _service) : ControllerBase
{
    [HttpPost(nameof(CreateBoardWithApiAndReturn))]
    public async Task<BoardDto> CreateBoardWithApiAndReturn([FromBody] CreateBoardDto dto)
    {
        return await _service.CreateBoard(dto);
    }

    [HttpPost(nameof(CreateTaskWithApiAndReturn))]
    public Task<TaskDto> CreateTaskWithApiAndReturn([FromBody] CreateTaskDto dto)
    {
        return _service.CreateTask(dto);
    }

    [HttpPut(nameof(UpdateTaskWithApiAndReturn))]
    public Task<TaskDto> UpdateTaskWithApiAndReturn([FromBody] UpdateTaskDto dto)
    {
        return _service.UpdateTask(dto);
    }

    [HttpGet(nameof(GetAllBoards))]
    public Task<List<BoardDto>> GetAllBoards([FromQuery] int userId)
    {
        return _service.GetAllBoards(userId);
    }
}