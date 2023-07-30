import { useQueryClient } from "@tanstack/react-query";
import { GrPauseFill, GrPlayFill } from "react-icons/gr";
import { shallow } from "zustand/shallow";
import { playbackService } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";

interface ICardProps {
  title: string;
  subtitle: string;
  image: string;
  type?: string;
  songUri?: string;
}
export default function Tile({
  title,
  subtitle,
  image,
  type,
  songUri,
}: ICardProps) {
  const [device_id, playback, player] = usePlaybackStore(
    (state) => [state.device_id, state.playback, state.player],
    shallow
  );
  const queryClient = useQueryClient();
  return (
    <div className="flex gap-2 items-center relative w-[350px] rounded-md cursor-pointer hover:bg-grack-700 bg-grack-800 group">
      <div className="">
        <img
          src={image}
          alt={subtitle}
          width="60px"
          height="60px"
          className="rounded-tl-md rounded-bl-md aspect-square"
        />
        <div
          className="absolute bottom-0 right-0 items-center justify-center hidden  m-3 text-black rounded-full aspect-square bg-spotify group-hover:flex p-3 text-center"
          onClick={() => {
            if (type === "track") {
              playbackService.play.songFn({
                device_id: device_id,
                spotify_uri: songUri,
              });
            }
          }}
        >
          {songUri === playback?.item?.uri && playback?.is_playing ? (
            <GrPauseFill
              onClick={() => {
                player.togglePlay();
                queryClient.invalidateQueries([
                  playbackService.playbackState.key,
                ]);
              }}
            />
          ) : (
            <GrPlayFill
              onClick={() => {
                player.togglePlay();
                queryClient.invalidateQueries([
                  playbackService.playbackState.key,
                ]);
              }}
            />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <h1 className="text-sm line-clamp-1 pr-1">{subtitle}</h1>
        <p className="text-sm text-gray-400 truncate">{title}</p>
      </div>
    </div>
  );
}
