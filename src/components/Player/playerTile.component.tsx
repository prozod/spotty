import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { shallow } from "zustand/shallow";
import usePlaybackStore from "../../store/playback.store";
import { determineImgSourcePath } from "../../utils/determineImgSourcePath";
import Liked from "../Liked/liked.component";

function PlayerTile() {
  const [marqueeTrigger, setMarqueeTrigger] = useState<boolean>(false);
  const songNameRef = useRef<HTMLParagraphElement | null>(null);
  const [playback] = usePlaybackStore((state) => [state.playback], shallow);

  useEffect(() => {
    songNameRef.current !== null &&
    songNameRef?.current?.getBoundingClientRect()?.width > 150
      ? setMarqueeTrigger(true)
      : setMarqueeTrigger(false);
  }, [playback?.item?.id]);

  return (
    <div className="text-sm flex gap-2 items-center justify-self-start">
      <div>
        <img
          src={playback && determineImgSourcePath(playback)}
          alt={playback?.item?.name}
          width={55}
          className="rounded-md"
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="hidden md:flex max-w-[250px] flex-col overflow-hidden">
          <p className="flex items-center gap-2 whitespace-nowrap group leading-2 cursor-pointer">
            <span
              ref={songNameRef}
              className={`text-sm font-semibold whitespace-nowrap ${
                marqueeTrigger && "animate-marquee"
              } group-hover:underline`}
            >
              {playback?.item?.name}
            </span>
            {marqueeTrigger && (
              <span
                className={`text-xs font-semibold whitespace-nowrap  animate-marquee group-hover:underline`}
              >
                {playback?.item?.name}
              </span>
            )}
          </p>

          <p className="line-clamp-1">
            {playback !== undefined &&
              playback?.currently_playing_type === "track" &&
              "artists" in playback.item &&
              playback?.item?.artists.map((artist, i) => (
                <Link
                  to={`/artist/${artist?.id}`}
                  className="hover:underline cursor-pointer hover:text-white text-gray-400"
                  key={artist?.id}
                >
                  {"artists" in playback.item &&
                  playback?.item?.artists.length === i + 1
                    ? artist.name
                    : artist.name.concat(", ")}
                </Link>
              ))}

            {playback !== undefined &&
              playback?.currently_playing_type === "episode" && (
                <Link
                  to={`/show/${playback?.item?.id}`}
                  className="hover:underline cursor-pointer hover:text-white text-gray-400"
                  key={playback?.item?.uri}
                >
                  {"show" in playback.item && playback?.item?.show?.name}
                </Link>
              )}
          </p>
        </div>
        {playback !== undefined && playback?.is_playing && (
          <Liked id={playback?.item?.id as string} />
        )}
      </div>
    </div>
  );
}
export default PlayerTile;
