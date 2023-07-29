import { Avatar, Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AiFillGithub } from "react-icons/ai";
import { BiErrorCircle, BiSolidMagicWand } from "react-icons/bi";
import {
  BsArrowDownCircle,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { LuExternalLink } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { userService } from "../../services/user.service";
import useUserStore from "../../store/user.store";
import useUnauthorizedState from "../../utils/useUnauthorizedState";

function Header() {
  useUnauthorizedState();
  const navigate = useNavigate();
  const [loggedIn, updateCurrentUser] = useUserStore(
    (state) => [state.loggedIn, state.updateCurrentUser],
    shallow
  );

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
    <nav className="w-full sticky top-0 z-50 flex justify-between gap-4 p-4 pb-10 bg-gradient-to-t from-transparent to-black items-center">
      <div className="flex gap-2 items-center">
        <BsChevronLeft
          size={37}
          className="active:scale-95 active:border-spotify flex items-center justify-center p-2 text-white rounded-full cursor-pointer bg-black/60 border-[0.5px] border-white/20"
          onClick={() => navigate(-1)}
        />
        <BsChevronRight
          className="active:scale-95 active:border-spotify flex items-center justify-center p-2 text-white rounded-full cursor-pointer bg-black/60 border-[0.5px] border-white/20"
          size={37}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <Link to="/search">
              <input
                type="search"
                id="search"
                className="flex items-center w-full px-4 py-3 pl-10 text-xs font-medium border border-grack-700 rounded-full bg-black/80 focus:ring-spotify focus:border-spotify placeholder-gray-500 text-white outline-none focus:outline-spotify/30"
                placeholder="Search"
                required
              />
            </Link>
          </div>
        </form>
      </div>
      <div className="flex gap-2 items-center">
        {data?.product === "free" && (
          <button
            className="rounded-full bg-red-500 text-white  p-1 text-xs font-bold"
            onClick={() =>
              notifications.show({
                withCloseButton: true,
                autoClose: 10000,
                title: "Spotify Free Plan",
                message:
                  "Certain features, such as controlling the playback of your songs, are available for Spotify Premium users only.",
                color: "red",
                icon: <BiErrorCircle />,
                loading: false,
              })
            }
          >
            <BiErrorCircle size={22} />
          </button>
        )}
        <button
          aria-label="Spotify Tools"
          className="bg-black/50 rounded-full hidden xl:block"
          onClick={() => {
            alert("Coming soon!");
          }}
        >
          <Link
            to="#" // --> /tools
            className="text-transparent bg-clip-text bg-opacity-50 flex items-center gap-2 px-4 py-2 text-sm rounded-full active:scale-95 font-extrabold bg-gradient-to-br from-lime-400 to-lime-200"
          >
            <BiSolidMagicWand size={20} className="text-lime-400" />
            Spotty Tools
          </Link>
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-black/50 active:scale-95 hidden lg:flex"
        >
          <AiFillGithub size={20} />
          Source code
        </a>
        <a
          href="https://www.spotify.com/download"
          target="_blank"
          rel="noreferrer"
          className="items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-black/50 active:scale-95 hidden lg:flex"
        >
          <BsArrowDownCircle size={20} />
          Install App
        </a>
        <Menu shadow="md" width={200} offset={10}>
          <Menu.Target>
            <Avatar
              src={data?.images[0]?.url}
              alt={data?.display_name}
              color="darkgreen"
              size="md"
              radius="xl"
              className="active:scale-95 active:border-spotify border-[1px] border-solid border-transparent cursor-pointer"
            >
              {data?.display_name.substring(0, 2).toUpperCase()}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown className="bg-grack-800 border-[2px] border-solid border-grack-700">
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
              onClick={() => {
                document.cookie =
                  "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                window.location.replace(
                  `${import.meta.env.VITE_BE_URL}/logout`
                );
              }}
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
