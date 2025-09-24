import TaskList from "./TaskList.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import {Api, type TaskDto} from "../../Api.ts";
import {useParams} from "react-router";
import {useAtom} from "jotai";
import {AllBoardsAtom} from "../atoms.ts";

export type BoardProps = {
    boardId: string;
}

export default function Board() {
    const api = new Api();
    const params = useParams<BoardProps>();
    const [boards, ] = useAtom(AllBoardsAtom);


    const [columns, setColumns] = useState<Record<string, TaskDto[]>>(() => {
        const board = boards.find((board) => board.boardId == params.boardId);
        if (!board) {
            return { "1": [], "2": [], "3": [] };
        }
        return {
            "1": board.tasks!.filter(t => t.status === "todo"),
            "2": board.tasks!.filter(t => t.status === "in-progress"),
            "3": board.tasks!.filter(t => t.status === "done"),
        };
    });

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = [...columns[source.droppableId]];
        const destCol = [...columns[destination.droppableId]];
        const [moved] = sourceCol.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceCol.splice(destination.index, 0, moved);
            setColumns({ ...columns, [source.droppableId]: sourceCol });
            return;
        }
        destCol.splice(destination.index, 0, moved);
        setColumns({
            ...columns,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol,
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board flex h-full flex-col">
                <div className="content justify-center h-full flex flex-row gap-20 p-10 overflow-x-scroll items-start">
                    <TaskList id="1" title="To Do" tasks={columns["1"]} />
                    <TaskList id="2" title="Doing" tasks={columns["2"]} />
                    <TaskList id="3" title="Done" tasks={columns["3"]} />
                </div>
            </div>
        </DragDropContext>
    );
}
