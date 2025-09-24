import TaskComponent from "./TaskComponent.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type {TaskDto} from "../../Api.ts";

interface TaskListProps {
    id: string;
    title: string;
    tasks: TaskDto[];
}

export default function TaskList({ id, title, tasks }: TaskListProps) {
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
                            key={task.taskId!.toString()}    // ensure unique string id
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

                    <div className="button-text-container flex items-center gap-2 mt-2 cursor-pointer">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add new task</span>
                    </div>
                </div>
            )}
        </Droppable>
    );
}
