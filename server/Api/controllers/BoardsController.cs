using App.dtos.reponses;
using App.dtos.requests;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class BoardsController : ControllerBase
{
    private readonly BoardService _service;

    public BoardsController(BoardService service)
    {
        _service = service;
    }

    [HttpPost(nameof(CreateBoardWithApiAndReturn))]
    public BoardDto CreateBoardWithApiAndReturn([FromBody] CreateBoardDto dto)
    {
        return _service.CreateBoard(dto);
    }

    [HttpPost(nameof(CreateTaskWithApiAndReturn))]
    public TaskDto CreateTaskWithApiAndReturn([FromBody] CreateTaskDto dto)
    {
        return _service.CreateTask(dto);
    }

    [HttpPatch(nameof(UpdateTaskWithApiAndReturn))]
    public TaskDto UpdateTaskWithApiAndReturn([FromBody] UpdateTaskDto dto)
    {
        return _service.UpdateTask(dto);
    }

    [HttpGet(nameof(GetAllBoards))]
    public List<BoardDto> GetAllBoards([FromQuery] int userId)
    {
        return _service.GetAllBoards(userId);
    }
}