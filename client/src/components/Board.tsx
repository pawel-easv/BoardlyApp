import TaskList from "./TaskList.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Api } from "../../Api.ts";
import { useParams } from "react-router";
import { useAtom } from "jotai";
import { AllBoardsAtom, TasksAtom } from "../atoms.ts";

const api = new Api();

export type BoardProps = {
    boardId: string;
};

const COLUMN_CONFIG = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In-progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" },
] as const;

export default function Board() {
    const params = useParams<BoardProps>();
    const [boards, setBoards] = useAtom(AllBoardsAtom);
    const currentBoard = boards.find(({ boardId }) => boardId == params.boardId);

    const [tasks, setTasks] = useAtom(TasksAtom);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(currentBoard?.title ?? "");

    useEffect(() => {
        if (currentBoard) {
            setTitle(currentBoard.title ?? "");
        }
    }, [currentBoard]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await api.getAllTasksForBoard.boardsGetAllTasksForBoard({
                    boardId: parseInt(params.boardId!)
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };
        loadTasks();
    }, [params.boardId, setTasks]);

    const onDragEnd = async (result: DropResult) => {
        const { destination } = result;
        if (!destination) return;

        const destCol = destination.droppableId;
        const taskIndex = tasks.findIndex(
            (t) => t.taskId?.toString() === result.draggableId
        );
        if (taskIndex === -1) return;

        const movedTask = { ...tasks[taskIndex], status: destCol };

        try {
            await api.updateTask.boardsUpdateTask({
                taskId: movedTask.taskId!,
                title: movedTask.title!,
                status: destCol,
            });

            const newTasks = [...tasks];
            newTasks.splice(taskIndex, 1);
            newTasks.push(movedTask);
            setTasks(newTasks);
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    const saveTitle = async () => {
        if (!currentBoard) return;

        try {
            await api.updateBoard.boardsUpdateBoard({
                boardId: Number(params.boardId),
                title: title
            });

            // update local state of boards
            const updatedBoards = boards.map((b) =>
                b.boardId == params.boardId ? { ...b, title } : b
            );
            setBoards(updatedBoards);
        } catch (err) {
            console.error("Failed to update board title:", err);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                className={isEditing ? "w-80 m-2 place-self-center" : "btn w-80 m-2 place-self-center"}
                onClick={() => !isEditing && setIsEditing(true)}
            >
                {isEditing ? (
                    <input
                        className="input input-primary w-full rounded-xl"
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitle();
                            if (e.key === "Escape") {
                                setTitle(currentBoard?.title ?? "");
                                setIsEditing(false);
                            }
                        }}
                    />
                ) : (
                    <h1>{title}</h1>
                )}
            </div>


            <div className="board flex h-full flex-col">
                <div className="content justify-center h-full flex flex-row gap-20 p-10 overflow-x-scroll items-start">
                    {COLUMN_CONFIG.map((column) => (
                        <TaskList
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            boardId={params.boardId!}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
}
