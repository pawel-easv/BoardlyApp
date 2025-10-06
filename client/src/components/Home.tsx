import SideMenu from "./SideMenu.tsx";
import {useNavigate} from "react-router";
import {AllBoardsAtom} from "../atoms.ts";
import {useAtom} from "jotai";
import {useEffect} from "react";
import boardImage from "../assets/kanban.png"
import {boardPath} from "../App.tsx";
import useBoardCrud from "../useBoardCrud.ts";

export default function Home(){
    var boardCrud = useBoardCrud();
    const [boards, ] = useAtom(AllBoardsAtom);

    const temporaryUserId = 1;


    useEffect(() => {
        boardCrud.getAllBoards(temporaryUserId);
    }, []);



    const navigate = useNavigate();
    return(
        <div className = "bg-base-100 w-screen h-screen flex flex-row">
            <SideMenu/>
            <div className={"flex flex-col p-10 gap-5 text-xl"}>
                <h1>Your boards: </h1>
                <div className={"boards-container flex place-items-start gap-10"}>
                    {boards.map((board, index) => (
                        <div className={"button-image-container p-15 flex flex-col"} key = {index} onClick={() => navigate(boardPath + board.boardId)}>
                            <img src={boardImage} alt = "board image" className={"w-20"}/>
                            <span>{board.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}