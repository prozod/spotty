import { Avatar, Menu } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
    BsArrowDownCircle,
    BsChevronLeft,
    BsChevronRight,
} from "react-icons/bs";
import { LuExternalLink } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { userService } from "../../services/user.service";
import useUserStore from "../../store/user.store";
import useUnauthorizedState from "../../utils/useUnauthorizedState";

function Header() {
    const navigate = useNavigate();
    const [loggedIn, updateCurrentUser] = useUserStore(
        (state) => [state.loggedIn, state.updateCurrentUser],
        shallow
    );
    useUnauthorizedState();

    const { data } = useQuery(
        [userService.userCredentials.key],
        userService.userCredentials.fn,
        {
            enabled: loggedIn,
        }
    );

    useEffect(() => {
        updateCurrentUser(data);
    });

    return (
        <nav className="w-full sticky top-0 z-50 flex justify-between gap-4 p-4 pb-10 bg-gradient-to-t from-transparent to-black">
            <div className="flex gap-2">
                <BsChevronLeft
                    size={36}
                    className="active:scale-95 flex items-center justify-center p-2 text-white rounded-full cursor-pointer bg-black/60 border-[0.5px] border-white/20"
                    onClick={() => navigate(-1)}
                />
                <BsChevronRight
                    className="active:scale-95 flex items-center justify-center p-2 text-white rounded-full cursor-pointer bg-black/60 border-[0.5px] border-white/20"
                    size={36}
                    onClick={() => navigate(1)}
                />

                <form>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="search"
                            className="flex items-center w-full px-4 py-3 pl-10 text-xs font-medium border border-grack-700 rounded-lg bg-grack-900 focus:ring-spotify focus:border-spotify placeholder-gray-500 text-white outline-none focus:outline-spotify/20"
                            placeholder="Search"
                            required
                        />
                    </div>
                </form>
            </div>
            <div className="flex gap-2">
                <a
                    href="https://www.spotify.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-black/50 hover:scale-105"
                >
                    <BsArrowDownCircle size={20} />
                    Install App
                </a>
                <Menu
                    shadow="md"
                    width={200}
                    transitionProps={{ transition: "rotate-right", duration: 150 }}
                >
                    <Menu.Target>
                        <Avatar
                            src={data?.images[0].url}
                            alt={data?.display_name}
                            color="darkgreen"
                            size="md"
                            radius="xl"
                            className="active:scale-95 cursor-pointer"
                        >
                            {data?.display_name.substring(0, 2).toUpperCase()}
                        </Avatar>
                    </Menu.Target>
                    <Menu.Dropdown className="border-none bg-grack-700">
                        <Menu.Item
                            rightSection={<LuExternalLink />}
                            className="text-white hover:bg-grack-600"
                            onClick={() =>
                                window.open(
                                    "https://www.spotify.com/account/overview/",
                                    "noopener",
                                    "noreferrer"
                                )
                            }
                        >
                            Account
                        </Menu.Item>
                        <Menu.Item className="text-white hover:bg-grack-600" disabled>
                            Profile
                        </Menu.Item>
                        <Menu.Item className="text-white hover:bg-grack-600" disabled>
                            Private session
                        </Menu.Item>
                        <Menu.Item className="text-white hover:bg-grack-600" disabled>
                            Settings
                        </Menu.Item>
                        <Menu.Item
                            className="text-white hover:bg-grack-600"
                            onClick={() =>
                                window.location.replace("http://localhost:3000/logout")
                            }
                        >
                            Log out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </nav>
    );
}

export default Header;
