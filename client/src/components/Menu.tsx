import logo from "../assets/logo.png";
import {useNavigate} from "react-router";

export default function Menu() {
    const navigate = useNavigate();
    return (
        <div className="flex w-full justify-between items-center pl-15 pr-15 pt-6 pb-6 bg-base-200 border-b-1 border-primary/30" onClick={() => navigate("/")}>
            <div className="btn btn-primary text-2xl p-5 flex items-center cursor-pointer">
                <img src={logo} alt="logo" className="h-8" />
                <span>Boardly</span>
            </div>
            <div className="btn btn-primary">
                <span>Log in</span>
            </div>
        </div>
    );
}
