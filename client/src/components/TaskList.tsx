import TaskComponent from "./TaskComponent.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Api, type TaskDto } from "../../Api.ts";

const api = new Api();

interface TaskListProps {
    id: string;
    title: string;
    boardId: string;
    tasks: TaskDto[];
    onTaskAdd: (task: TaskDto) => void;
    onTaskUpdate: (task: TaskDto) => void;
}

export default function TaskList({
                                     id,
                                     title,
                                     boardId,
                                     onTaskAdd,
                                     tasks,
                                 }: TaskListProps) {

    const addNewTask = async () => {
        try {
            const created = await api.createTaskWithApiAndReturn.boardsCreateTaskWithApiAndReturn({
                boardId: Number(boardId),
                title: "New Task",
                status: id,
            });
            onTaskAdd(created.data);
        } catch (err) {
            console.error("Failed to create task", err);
        }
    };

    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <div
                    className="TaskList flex flex-col p-3 gap-4 min-w-[250px] bg-base-300/50 rounded-3xl"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h1 className="text-xl w-full text-left ml-4 mt-2 mb-2">{title}</h1>

                    {tasks.map((task, index) => (
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
