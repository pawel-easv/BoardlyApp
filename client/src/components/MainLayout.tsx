import Menu from "./Menu.tsx";
import {Outlet} from "react-router";

export default function MainLayout(){
    return(
        <div className="flex flex-col min-h-screen h-screen overflow-hidden">
            <Menu/>
            <Outlet/>
        </div>

    )
}