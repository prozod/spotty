import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BiRepeat } from "react-icons/bi";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { shallow } from "zustand/shallow";
import { toggleShuffle } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import millisToMinutesAndSeconds from "../../utils/msConversion";

function PlayerBar({ playback }) {
  const [sliderPos, setSliderPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  let progress_ms = Number((playback?.progress_ms! / 1000)?.toFixed(0));
  let duration_ms = Number((playback?.item?.duration_ms! / 1000)?.toFixed(0));
  const [pb, player] = usePlaybackStore(
    (state) => [state.playback, state.player],
    shallow
  );

  useEffect(() => {
    setSliderPos(progress_ms);
  }, [playback?.progress_ms!]);

  let progress_to_percentage =
    ((sliderPos / duration_ms) * 100).toFixed(2) + "%";

  const toggShuffle = useMutation({
    mutationFn: (state) => toggleShuffle({ state: state }),
  });

  return (
    <section className="flex flex-col items-center flex-1 gap-2 w-96 justify-self-center grow">
      <div className="flex gap-4 items-center [&>*]:cursor-pointer">
        <IoShuffleOutline
          size={22}
          onClick={() =>
            toggShuffle.mutate(pb?.shuffle === true ? "false" : "true")
          }
          className={pb?.shuffle === true ? "text-spotify" : "text-white"}
        />
        <MdSkipPrevious size={28} onClick={() => player.previousTrack()} />
        {playback?.is_playing ? (
          <FaPauseCircle size={28} onClick={() => player.togglePlay()} />
        ) : (
          <FaPlayCircle size={28} onClick={() => player.togglePlay()} />
        )}
        <MdSkipNext size={28} onClick={() => player.nextTrack()} />
        <BiRepeat size={22} className="rotate-180" />
      </div>
      <div className="flex items-center flex-1 gap-4 text-xs">
        <span className="opacity-60 w-[35px]">
          {playback?.item !== undefined
            ? millisToMinutesAndSeconds(playback?.progress_ms!)
            : "-:--"}
        </span>
        <div
          className="group relative h-[5px] w-[30vw] cursor-pointer flex items-center [&>*]:rounded-md"
          id="playbar"
        >
          <input
            className="transition-all playbar"
            type="range"
            min={0}
            max={duration_ms}
            step="0.001"
            value={sliderPos.toFixed(1)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: `linear-gradient(to right, ${
                hovered ? "#1ed760" : "#fff"
              } ${progress_to_percentage}, ${progress_to_percentage}, #282828 0%, #282828 100%)`,
            }}
            onChange={(e) => {
              setSliderPos(+e.currentTarget.value);
              player.seek(+e.currentTarget.value * 1000);
            }}
          />
        </div>
        <span className=" w-[35px] opacity-60">
          {playback?.item !== undefined
            ? millisToMinutesAndSeconds(playback?.item?.duration_ms!)
            : "-:--"}
        </span>
      </div>
    </section>
  );
}
export default PlayerBar;
