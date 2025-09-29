import TaskList from "./TaskList.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect} from "react";
import { Api } from "../../Api.ts";
import { useParams } from "react-router";
import { useAtom } from "jotai";
import { TasksAtom } from "../atoms.ts";
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
    const [tasks, setTasks] = useAtom(TasksAtom);

    // fetch the tasks once
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
    }, []);

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
            await api.updateTaskWithApiAndReturn.boardsUpdateTaskWithApiAndReturn({
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
