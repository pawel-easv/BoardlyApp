import TaskList from "./TaskList.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import {useState, useMemo} from "react";
import { Api, type TaskDto } from "../../Api.ts";
import { useParams } from "react-router";
import { useAtom } from "jotai";
import { AllBoardsAtom } from "../atoms.ts";

export type BoardProps = {
    boardId: string;
}

const COLUMN_CONFIG = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In-progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" }
] as const;


export default function Board() {
    const api = useMemo(() => new Api(), []);
    const params = useParams<BoardProps>();
    const [boards] = useAtom(AllBoardsAtom);
    const board = boards.find((b) => b.boardId == params.boardId);
    const [tasks, setTasks] = useState<TaskDto[]>(board?.tasks ?? []);

    const columns = useMemo(() => ({
        "todo": tasks.filter(t => t.status === "todo"),
        "in-progress": tasks.filter(t => t.status === "in-progress"),
        "done": tasks.filter(t => t.status === "done"),
    }), [tasks]);

    const onDragEnd = async (result: DropResult) => {
        const {destination} = result;
        if (!destination) return;

        const destCol = destination.droppableId;

        const taskIndex = tasks.findIndex(
            t => t.taskId?.toString() === result.draggableId
        );
        if (taskIndex === -1) return;

        const movedTask = { ...tasks[taskIndex], status: destCol };

        try {
            await api.updateTaskWithApiAndReturn.boardsUpdateTaskWithApiAndReturn({
                taskId: movedTask.taskId!,
                title: movedTask.title!,
                status: destCol,
            });

            // Update tasks array
            const newTasks = [...tasks];
            newTasks.splice(taskIndex, 1);       // remove from old position
            newTasks.push(movedTask);            // add at the end of destination
            setTasks(newTasks);
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };



    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board flex h-full flex-col">
                <div className="content justify-center h-full flex flex-row gap-20 p-10 overflow-x-scroll items-start">
                    {COLUMN_CONFIG.map(column => (
                        <TaskList
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={columns[column.id]}
                            boardId={params.boardId!}
                            onTaskAdd={(newTask) => setTasks(prev => [...prev, newTask])}
                            onTaskUpdate={(updatedTask) =>
                                setTasks(prev => prev.map(t => t.taskId === updatedTask.taskId ? updatedTask : t))
                            }
                        />

                    ))}
                </div>
            </div>
        </DragDropContext>
    );
}