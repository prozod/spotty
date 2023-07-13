// import { addItemToQueue } from "@.services/player.services";
// import { usePlaybackStore } from "@.store/player";
// import { PlaylistTrack, Track } from "@.types/spotify";
// import { playContext, playSong } from "@.utils/playerActions";
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { PlaylistTrack, Track } from "../../types/spotify";
import millisToMinutesAndSeconds from "../../utils/msConversion";
import Skeleton from "../Skeleton/skeleton.component";
import usePlaybackStore from "../../store/playback.store";
import { shallow } from "zustand/shallow";

export const WavebarIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="wavebar"
        d="M3.99902 14H5.99902V0H3.99902V14ZM-0.000976562 14H1.9902V4H-0.000976562V14ZM12 7V14H14V7H12ZM8.00002 14H10V10H8.00002V14Z"
        fill="#1DB954"
      />
    </svg>
  );
};

function PlaylistItem({
  playlistContext,
  track,
  playlistItem,
  total,
  loading,
}: {
  track?: Track | null;
  playlistItem?: PlaylistTrack | null;
  total?: number;
  playlistContext?: any;
  loading?: boolean;
}) {
  const [currentSongPlaying, setCurrentSongPlaying] = useState<boolean>(false);
  const [playback] = usePlaybackStore((state) => [state.playback], shallow);
  const [playButton, setPlayButton] = useState<JSX.Element | number | string>(
    total || 0
  );
  const song = playlistItem?.track !== undefined ? playlistItem?.track : track;
  // const songCurrentlyPlaying = playlist?.tracks.items.find(
  //   (track) => track.track?.id === playback?.item?.id
  // );

  useEffect(() => {
    setCurrentSongPlaying(
      playback?.item?.id === song?.id && (playback?.is_playing as boolean)
    );
    if (currentSongPlaying) {
      setPlayButton(<WavebarIcon />);
    } else {
      setPlayButton(total as number);
    }
  }, [playback, total]);

  // let playingDevice = devices?.devices.filter((d) => d.is_active && d);
  if (loading) {
    return (
      <section className="gap-4 text-sm grid-cols-playlist grid px-2 py-2 rounded-md hover:bg-white/10 items-center">
        <Skeleton width="full" height="25px" />
        <Skeleton width="full" height="25px" />
        <Skeleton width="full" height="25px" />
        <Skeleton width="full" height="25px" />
        <Skeleton width="full" height="25px" />
      </section>
    );
  } else {
    return (
      <div
        className="text-sm grid-cols-playlistMobile lg:grid-cols-playlist grid px-2 py-2 rounded-md hover:bg-white/10 items-center"
        key={song?.uri}
        onMouseEnter={() => {
          if (currentSongPlaying) {
            setPlayButton(<BsPauseFill size={18} />);
          } else {
            setPlayButton(<BsPlayFill size={18} />);
          }
        }}
        onMouseLeave={() => {
          if (currentSongPlaying) {
            <WavebarIcon />;
          } else {
            setPlayButton(total!);
          }
        }}
        onFocus={() => setPlayButton(<BsPlayFill size={18} />)}
        onBlur={() => setPlayButton(total!)}
      >
        <button
          className="col-start-1 flex items-center justify-center cursor-pointer w-auto h-auto text-sm aspect-square transition-all"
          data-id={song?.uri}
          data-track-index={total}
          // onClick={(e) => {
          //   if (playlistContext) {
          //     console.log(
          //       "Playing track id: ",
          //       Number(total) - 1,
          //       song?.name,
          //       playlistContext?.uri,
          //       song?.uri
          //     );
          //     playContext({
          //       access_token: accessToken!,
          //       context_uri: playlistContext?.uri,
          //       offset: Number(total) - 1,
          //     });
          //   } else {
          //     playSong({
          //       access_token: accessToken!,
          //       device_id: current_device,
          //       spotify_uri: song?.uri,
          //     });
          //   }
          // }}
        >
          {playButton}
        </button>
        <div className="ml-2 flex items-center gap-3 w-full">
          <img
            src={song?.album?.images[0]?.url}
            alt={song?.name}
            width={40}
            height={40}
            className="rounded-sm"
          />
          <div className="">
            <p
              className={`cursor-pointer line-clamp-1 ${
                playback?.item?.id === song?.id &&
                playback?.is_playing &&
                "text-green-400"
              }`}
              // onDoubleClick={() => {
              //   addSongToQueue.mutate(song?.uri);
              // }}
            >
              {song?.name}
            </p>
            <div className="inline-flex">
              {song?.artists?.map((artist, i: number) => {
                if (i + 1 === song?.artists.length) {
                  return (
                    <span
                      key={artist.id}
                      className="cursor-pointer opacity-60 hover:opacity-90 hover:underline"
                    >
                      {artist.name}
                    </span>
                  );
                } else {
                  return (
                    <span key={artist.id} className="flex">
                      <span className="cursor-pointer opacity-60 hover:opacity-90 hover:underline line-clamp-1">
                        {artist.name}
                      </span>
                      <span className="opacity-60">,&nbsp;</span>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <p className="col-start-3 opacity-60 hover:underline hover:opacity-90 cursor-pointer line-clamp-2 hidden lg:block">
          {song?.album?.name}
        </p>
        {/*
     adding timeStyle prop to Intl API will display the time too, but Spotify doenst show it so omitting it wont show it
    */}
        {playlistItem !== undefined && (
          <p className="hidden lg:block col-start-4 opacity-60 cursor-default">
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "long",
            }).format(Date.parse(playlistItem?.added_at as string))}
          </p>
        )}
        <p className="col-start-5 cursor-default opacity-60">
          {millisToMinutesAndSeconds(song?.duration_ms)}
        </p>
      </div>
    );
  }
}

export default PlaylistItem;
