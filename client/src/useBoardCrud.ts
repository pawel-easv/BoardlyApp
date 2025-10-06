import {AllTasksAtom, AllBoardsAtom} from "./atoms.ts";
import {Api, type BoardDto, type TaskDto} from "../Api.ts";
import {useAtom} from "jotai";

var api = new Api();

export default function useBoardCrud(){
    const [tasks, setTasks] = useAtom(AllTasksAtom);
    const [boards, setBoards] = useAtom(AllBoardsAtom);

    async function updateBoards(dto: BoardDto){
        try {
            await api.updateBoard.boardsUpdateBoard({
                boardId: Number(dto.boardId),
                title: dto.title
            });

            const updatedBoards = boards.map((b) =>
                b.boardId == dto.boardId ? { ...b, title: dto.title } : b
            );
            setBoards(updatedBoards);
        } catch (err) {
            console.error("Failed to update board title:", err);
        }
    }
    async function loadTasks ( boardId: string){
        try {
            const res = await api.getAllTasksForBoard.boardsGetAllTasksForBoard({
                boardId: parseInt(boardId)
            });
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    }

    async function deleteBoard (boardId: number){
        try{
            await api.deleteBoard.boardsDeleteBoard({boardId: boardId});
        } catch (err) {
            console.error("Failed to delete board:", err);
        }
    }
    function getBoard (id: number){
        return boards.find(({boardId}) => boardId == id);
    }

    async function moveTask(dto: TaskDto, index: number){
        try {
            await api.updateTask.boardsUpdateTask({
                taskId: dto.taskId!,
                title: dto.title!,
                status: dto.status!,
            });

            const newTasks = [...tasks];
            newTasks.splice(index, 1);
            newTasks.push(dto);
            setTasks(newTasks);
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    }

    async function updateTask (dto: TaskDto){
        try {
            const updated =
                await api.updateTask.boardsUpdateTask({
                    taskId: dto.taskId!,
                    title: dto.title!,
                    status: dto.status!,
                });

            setTasks((prev) =>
                prev.map((t) => (t.taskId === dto.taskId ? updated.data : t))
            );

        } catch (err) {
            console.error("Failed to update task title:", err);
        }
    }

    async function deleteAllTasksForBoard(id: number){
        try {
            await api.deleteAllTasksForBoard.boardsDeleteAllTasksForBoard({
                boardId: id,
            });

            setTasks((prev) => prev.filter(t => t.boardId !== id));
        } catch (err) {
            console.error("Failed to delete tasks:", err);
        }
    }
    async function getAllBoards(userId: number){
        api.getAllBoards.boardsGetAllBoards({ userId: userId })
            .then((response) => {
                console.log(response);
                setBoards(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return{updateBoards, loadTasks, updateTask, deleteBoard, getBoard, moveTask, deleteAllTasksForBoard, getAllBoards};
}