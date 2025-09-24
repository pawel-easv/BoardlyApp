import {createBrowserRouter, RouterProvider} from "react-router";
import Home from "./components/Home";
import {useAtom} from "jotai";
import {ThemeAtom} from "./atoms.ts";
import Board from "./components/Board.tsx";
import MainLayout from "./components/MainLayout.tsx";

export const boardPath = "/board/"

const myRoutes= [
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                path:"/",
                element: <Home/>,
            },
            {
                path:boardPath + ":boardId",
                element: <Board/>,
            }
        ],
    },
]

function App() {
    const [colorTheme] = useAtom(ThemeAtom);



  return <div className="App" data-theme={colorTheme}>
      <RouterProvider router={createBrowserRouter(myRoutes)}>{
      }
      </RouterProvider>
  </div>

}

export default App
