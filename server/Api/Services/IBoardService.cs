using App.dtos.reponses;
using App.dtos.requests;

namespace api.Services;

public interface IBoardService
{
    Task<BoardDto> CreateBoard(CreateBoardDto dto);
    Task<BoardDto> UpdateBoard(UpdateBoardDto dto);
    Task<List<BoardDto>> GetAllBoards(int userId);
    Task<TaskDto> CreateTask(CreateTaskDto dto);
    Task<TaskDto> UpdateTask(UpdateTaskDto dto);
    Task<List<TaskDto>> GetAllTasksForBoard(int boardId);
    Task<TaskDto> DeleteTask(int taskId);
}