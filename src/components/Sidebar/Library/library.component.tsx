import { useQuery } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import { PiPlaylistFill } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { playlistService } from "../../../services/playlist.service";
import usePlaybackStore from "../../../store/playback.store";
import useUserStore from "../../../store/user.store";

export default function Library() {
  const location = useLocation();
  const visitedPlaylistId = location?.pathname?.split("/")[2] as string;
  const [playback] = usePlaybackStore((state) => [state.playback], shallow);
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);
  const { data } = useQuery(
    [playlistService.currentUserPlaylists.key],
    playlistService.currentUserPlaylists.fn,
    { enabled: loggedIn }
  );

  return (
    <nav className="overflow-hidden pb-8">
      <div className="flex justify-between gap-4 py-2 pl-6 pr-2 text-sm font-bold">
        <span className="flex items-center gap-4 text-xl text-white">
          Playlists
        </span>
        <span className="flex text-xs font-medium gap-2 bg-grack-800 py-1 px-3 rounded-full items-center hover:text-spotify cursor-pointer border-transparent border-[1.5px] border-solid hover:border-spotify transition-all">
          <AiOutlinePlus size={17} />
          New
        </span>
      </div>
      <div className="h-[95%] rounded-md ml-3 overflow-y-scroll">
        {data?.items?.map((playlist) => (
          <Link
            to={`/playlist/${playlist.id}`}
            className={`flex items-center gap-4 px-2 py-2 text-white rounded-md hover:bg-white/10 group text-opacity-70 hover:text-opacity-100 mr-1 ${
              visitedPlaylistId === playlist.id && "bg-white/10"
            }`}
            key={playlist.id}
          >
            <PiPlaylistFill
              size={22}
              className={`${
                playlist.id === playback?.context?.uri.split(":")[2] &&
                "text-spotify animate-pulse"
              }`}
            />
            <p
              className={`group-hover:text-opacity-100 group-hover:cursor-pointer truncate ${
                playlist.id === playback?.context?.uri.split(":")[2] &&
                "text-spotify"
              }`}
            >
              {playlist.name}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
}
