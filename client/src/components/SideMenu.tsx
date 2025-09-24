import {faChalkboard, faChalkboardUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSetAtom} from "jotai";
import {ColorTheme, ThemeAtom} from "../atoms.ts";
import {Api} from "../../Api.ts";

const api = new Api();


export default function SideMenu() {
    const setThemeAtom = useSetAtom(ThemeAtom);

    function ToggleColorTheme(colorTheme: ColorTheme) {
        setThemeAtom(colorTheme);
    }

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    async function createNewBoard() {
        const response = await api.createBoardWithApiAndReturn.boardsCreateBoardWithApiAndReturn({
            userId: 0,
            description: undefined,
            title: "New Board",
        });
        return response;
    }

    return (
        <div className="flex flex-col align-middle self-start h-full w-[20vw] bg-base-200 p-5 gap-5 border-r-1 border-primary/30">
            <div className="button-text-container">
                <FontAwesomeIcon icon={faChalkboardUser} />
                <span>Your boards</span>
            </div>
            <div className="button-text-container" onClick={createNewBoard}>
                <FontAwesomeIcon icon={faChalkboard} />
                <span>Create new board</span>
            </div>
            <div>
                <select className={"w-[10vw] select select-primary"} onChange={(e) => ToggleColorTheme(e.target.value as ColorTheme)}>
                    <option selected disabled hidden>Color theme</option>
                    {Object.values(ColorTheme).map((color) => (
                        <option key={color} value={color}>{capitalizeFirstLetter(color)}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}