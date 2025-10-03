import TaskComponent from "./TaskComponent.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Api } from "../../Api.ts";
import { useAtom } from "jotai";
import { TasksAtom } from "../atoms.ts";

const api = new Api();

interface TaskListProps {
    id: string;
    title: string;
    boardId: string;
}

export default function TaskList({ id, title, boardId }: TaskListProps) {
    const [tasks, setTasks] = useAtom(TasksAtom);

    const tasksForThisList = tasks.filter((t) => t.status === id);

    const addNewTask = async () => {
        try {
            const created = await api.createTask.boardsCreateTask({
                boardId: Number(boardId),
                title: "New Task",
                status: id,
            });
            setTasks((prev) => [...prev, created.data]);
        } catch (err) {
            console.error("Failed to create task", err);
        }
    };

    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <div
                    className="TaskList flex flex-col p-3 gap-4 w-[20vw] bg-base-300/50 rounded-3xl"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h1 className="text-xl w-full text-left ml-4 mt-2 mb-2">
                        {title}
                    </h1>

                    {tasksForThisList.map((task, index) => (
                        <Draggable
                            key={task.taskId!.toString()}
                            draggableId={task.taskId!.toString()}
                            index={index}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <TaskComponent task={task} />
                                </div>
                            )}
                        </Draggable>
                    ))}

                    {provided.placeholder}

                    <div
                        className="button-text-container flex items-center gap-2 mt-2 cursor-pointer"
                        onClick={addNewTask}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add new task</span>
                    </div>
                </div>
            )}
        </Droppable>
    );
}
