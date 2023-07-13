import { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import usePlaybackStore from "../../store/playback.store";

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
          src={playback?.item?.album?.images[1].url}
          alt={playback?.item?.name}
          width={55}
          className="rounded-md"
        />
      </div>
      <div className="hidden md:flex max-w-[280px] flex-col overflow-hidden">
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
          {playback?.item?.artists.map((artist, i) => (
            <span className="hover:text-red-200 text-gray-400" key={artist?.id}>
              {playback?.item?.artists.length === i + 1
                ? artist.name
                : artist.name.concat(", ")}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
export default PlayerTile;
