import TaskList from "./TaskList.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router";
import { useAtom } from "jotai";
import {faEraser, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useBoardCrud from "../useBoardCrud.ts";
import {AllTasksAtom} from "../atoms.ts";


export type BoardProps = {
    boardId: string;
};

const COLUMN_CONFIG = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In-progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" },
] as const;

export default function Board() {
    const boardCrud = useBoardCrud();
    const navigate = useNavigate();
    const params = useParams<BoardProps>();
    const currentBoard = boardCrud.getBoard(parseInt(params.boardId!));

    const [tasks, setTasks] = useAtom(AllTasksAtom);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(currentBoard?.title ?? "");

    useEffect(() => {
        if (currentBoard) {
            setTitle(currentBoard.title ?? "");
        }
    }, [currentBoard]);

    useEffect(() => {
        boardCrud.loadTasks(params.boardId!);
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

        await boardCrud.moveTask(movedTask, taskIndex);
    };

    const deleteAllTasks = async () => {
        if (!currentBoard) return;

        await boardCrud.deleteAllTasksForBoard(currentBoard.boardId!);
    };

    const deleteCurrentBoard = async () =>{
        if (!currentBoard) return;

        await boardCrud.deleteBoard(currentBoard.boardId!);
        navigate("/");
    }


    const saveTitle = async () => {
        if (!currentBoard) return;
        currentBoard.title = title;
        try {
            await boardCrud.updateBoards(currentBoard);
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
            <div className={"flex flex-row actions-container place-self-end m-15 gap-1"}>
                <div className={"btn w-15 h-15"} onClick={() => deleteAllTasks()}>
                    <FontAwesomeIcon icon={faEraser} />
                </div>

                <div className = "btn w-15 h-15 text-red-500" onClick = {() => deleteCurrentBoard()}>
                    <FontAwesomeIcon
                        icon={faTrash}/>
                </div>
            </div>
        </DragDropContext>
    );
}
