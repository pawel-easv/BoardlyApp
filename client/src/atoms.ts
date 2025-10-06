import { atom } from "jotai";
import type {BoardDto, TaskDto} from "../Api.ts";

// @ts-ignore
export enum ColorTheme {
    LIGHT = "light",
    DARK = "dark",
    COFFEE = "coffee",
    NIGHT = "night",
    DRACULA = "dracula",
    PASTEL = "pastel",
    CYBERPUNK = "cyberpunk",
}
export const AllThemesAtom = atom("coffee");

export const AllBoardsAtom = atom<BoardDto[]>([]);

export const AllTasksAtom = atom<TaskDto[]>([]);