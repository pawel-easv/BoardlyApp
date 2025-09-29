import type { TaskDto } from "../../Api.ts";
import { useState, useMemo } from "react";
import { Api } from "../../Api.ts";
import { useAtom } from "jotai";
import { TasksAtom } from "../atoms.ts";

interface TaskProps {
    task: TaskDto;
}

export default function TaskComponent({ task }: TaskProps) {
    const api = useMemo(() => new Api(), []);
    const [tasks, setTasks] = useAtom(TasksAtom);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title ?? "");

    const saveTitle = async () => {
        if (title.trim() === "" || title === task.title) {
            setIsEditing(false);
            return;
        }

        try {
            const updated = await api.updateTaskWithApiAndReturn.boardsUpdateTaskWithApiAndReturn({
                taskId: task.taskId!,
                title,
                status: task.status!,
            });

            // Update atom with new task title
            setTasks((prev) =>
                prev.map((t) => (t.taskId === task.taskId ? updated.data : t))
            );

            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update task title:", err);
        }
    };

    return (
        <div
            className="bg-primary/20 w-full rounded-2xl min-h-8 p-3 cursor-pointer"
            onClick={() => !isEditing && setIsEditing(true)}
        >
            {isEditing ? (
                <input
                    className="input input-primary rounded-xl"
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
        </div>
    );
}
