import type { TaskDto } from "../../Api.ts";
import { useState, useMemo } from "react";
import { Api } from "../../Api.ts";
import { useAtom } from "jotai";
import { AllTasksAtom } from "../atoms.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useBoardCrud from "../useBoardCrud.ts";


interface TaskProps {
    task: TaskDto;
}

export default function TaskComponent({ task }: TaskProps) {
    var boardCrud = useBoardCrud();
    const api = useMemo(() => new Api(), []);
    const [, setTasks] = useAtom(AllTasksAtom);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title ?? "");

    const saveTitle = async () => {
        if (title.trim() === "" || title === task.title) {
            setIsEditing(false);
            return;
        }

        await boardCrud.updateTask(task);
        setIsEditing(false);
    };

    const deleteTask = async () => {
        try {
            await api.deleteTask.boardsDeleteTask({ taskId: task.taskId! });
            setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    return (
        <div
            className="group flex flex-row items-center w-full bg-primary/20 rounded-2xl p-4 cursor-pointer"
            onClick={() => !isEditing && setIsEditing(true)}
        >
            {isEditing ? (
                <input
                    className="input input-primary w-[80%] rounded-xl"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") saveTitle();
                        if (e.key === "Escape") {
                            setTitle(task.title ?? "");
                            setIsEditing(false);
                        }
                    }}
                />
            ) : (
                <h1>{title}</h1>
            )}

            <FontAwesomeIcon
                icon={faTrash}
                className="ml-auto text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation(); // prevent triggering edit mode
                    deleteTask();
                }}
            />
        </div>
    );
}
