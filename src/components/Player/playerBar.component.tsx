import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BiErrorCircle, BiRepeat } from "react-icons/bi";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { shallow } from "zustand/shallow";
import {
  playbackService,
  toggleShuffle,
} from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import useUserStore from "../../store/user.store";
import millisToMinutesAndSeconds from "../../utils/msConversion";

function PlayerBar() {
  const queryClient = useQueryClient();
  const [sliderPos, setSliderPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [currentUser] = useUserStore((state) => [state.currentUser]);
  const [playback, webPlayback, player] = usePlaybackStore(
    (state) => [state.playback, state.webSDKplayback, state.player],
    shallow
  );
  let progress_ms = Number((playback?.progress_ms! / 1000)?.toFixed(0));
  let duration_ms = Number((playback?.item?.duration_ms! / 1000)?.toFixed(0));

  useEffect(() => {
    setSliderPos(progress_ms);
  }, [playback?.progress_ms!]);

  let progress_to_percentage =
    ((sliderPos / duration_ms) * 100).toFixed(2) + "%";

  const toggShuffle = useMutation({
    mutationFn: (state: boolean) => toggleShuffle({ state: state }),
  });

  return (
    <section className="flex flex-col items-center flex-1 gap-2 w-96 justify-self-center grow">
      <div className="flex gap-4 items-center [&>*]:cursor-pointer">
        <IoShuffleOutline
          size={22}
          onClick={() =>
            toggShuffle.mutate(webPlayback?.shuffle === true ? false : true)
          }
          className={
            webPlayback?.shuffle === true ? "text-spotify" : "text-white"
          }
        />

        <MdSkipPrevious size={28} onClick={() => player.previousTrack()} />
        {playback?.is_playing ? (
          <FaPauseCircle
            size={28}
            onClick={() => {
              {
                currentUser?.product === "free" &&
                  notifications.show({
                    withCloseButton: true,
                    autoClose: 10000,
                    title: "Spotify Free Plan",
                    message:
                      "Certain features, such as controlling the playback of your songs, are available for Spotify Premium users only.",
                    color: "red",
                    icon: <BiErrorCircle />,
                    loading: false,
                  });
              }
              player?.togglePlay();
              queryClient.invalidateQueries([
                playbackService.playbackState.key,
              ]);
              queryClient.refetchQueries([playbackService.playbackState.key]);
            }}
          />
        ) : (
          <FaPlayCircle
            size={28}
            onClick={() => {
              {
                currentUser?.product === "free" &&
                  notifications.show({
                    withCloseButton: true,
                    autoClose: 10000,
                    title: "Spotify Free Plan",
                    message:
                      "Certain features, such as controlling the playback of your songs, are available for Spotify Premium users only.",
                    color: "red",
                    icon: <BiErrorCircle />,
                    loading: false,
                  });
              }
              player?.togglePlay();
              queryClient.invalidateQueries([
                playbackService.playbackState.key,
              ]);
              queryClient.refetchQueries([playbackService.playbackState.key]);
            }}
          />
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
            max={duration_ms || 0}
            step="0.001"
            value={sliderPos || 0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: `linear-gradient(to right, ${
                hovered ? "#1ed760" : "#fff"
              } ${
                progress_to_percentage !== "NaN%"
                  ? progress_to_percentage
                  : "0%"
              }, ${
                progress_to_percentage !== "NaN%"
                  ? progress_to_percentage
                  : "0%"
              }, #282828 0%, #282828 100%)`,
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
