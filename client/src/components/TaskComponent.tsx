import type {TaskDto} from "../../Api.ts";

interface TaskProps {
    task: TaskDto;
}

export default function TaskComponent(props: TaskProps) {
    return(
        <div className="bg-primary/20 w-full rounded-2xl min-h-8 p-2">
        <h1>{props.task.title}</h1>
        </div>
    )
}