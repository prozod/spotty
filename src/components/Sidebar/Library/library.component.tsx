import { useQuery } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { playlistService } from "../../../services/playlist.service";
import { PiPlaylistFill } from "react-icons/pi";

export default function Library() {
  const navigate = useNavigate();
  const { data } = useQuery(
    [playlistService.currentUserPlaylists.key],
    playlistService.currentUserPlaylists.fn
  );
  console.log(data);
  return (
    <nav className="overflow-hidden">
      <div className="flex justify-between gap-4 py-2 pl-6 pr-2 text-sm font-bold">
        <span className="flex items-center gap-4 text-xl text-white">
          Playlists
        </span>
        <span className="flex text-xs font-medium gap-2 bg-grack-800 py-1 px-3 rounded-full items-center hover:text-spotify cursor-pointer border-transparent border-[1.5px] border-solid hover:border-spotify transition-all">
          <AiOutlinePlus size={17} />
          New
        </span>
      </div>
      <div className="h-full pb-2 ml-3 overflow-y-scroll">
        {data?.items?.map((playlist, i) => (
          <span className="flex items-center gap-4 px-2 py-2 text-white rounded-md hover:bg-white/10 group text-opacity-70 hover:text-opacity-100">
            <PiPlaylistFill
              size={22}
              className={`${i === 3 && "text-spotify animate-pulse"}`}
            />
            <p
              className={`group-hover:text-opacity-100 group-hover:cursor-pointer truncate ${
                i === 3 && "text-spotify"
              }`}
            >
              {playlist.name}
            </p>
          </span>
        ))}
      </div>
    </nav>
  );
}
