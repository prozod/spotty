import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { playbackService } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import useUserStore from "../../store/user.store";
import { PlaylistTrack, Track } from "../../types/spotify";
import millisToMinutesAndSeconds from "../../utils/msConversion";
import Liked from "../Liked/liked.component";
import Skeleton from "../Skeleton/skeleton.component";

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
  track,
  playlistItem,
  total,
  loading,
}: {
  track?: Track;
  playlistItem?: PlaylistTrack;
  total?: number;
  loading?: boolean;
}) {
  const location = useLocation();
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [currentSongPlaying, setCurrentSongPlaying] = useState<boolean>(false);
  const [playback] = usePlaybackStore((state) => [state.playback], shallow);
  const [currentUser] = useUserStore((state) => [state.currentUser], shallow);
  const [playButton, setPlayButton] = useState<JSX.Element | number | string>(
    total || 0
  );
  const [device_id, player] = usePlaybackStore(
    (state) => [state.device_id, state.player],
    shallow
  );

  const song =
    playlistItem && "track" in playlistItem ? playlistItem?.track : track;

  useEffect(() => {
    setCurrentSongPlaying(
      playback?.item?.id === song?.id && (playback?.is_playing as boolean)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback, total]);

  useEffect(() => {
    if (currentSongPlaying) {
      setPlayButton(<WavebarIcon />);
    } else {
      setPlayButton(total as number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongPlaying]);

  useEffect(() => {
    if (location?.pathname === "/collection/liked") {
      setCurrentContext(`spotify:user:${currentUser?.id}:collection`);
    } else {
      setCurrentContext(
        `spotify:${location.pathname.split("/")[1]}:${
          location.pathname.split("/")[2]
        }`
      );
    }
  }, [location, currentUser]);

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
        className={`hover:cursor-pointer text-sm grid-cols-playlistMobile lg:grid-cols-playlist grid px-2 py-2 rounded-md hover:bg-white/10 items-center ${
          location.pathname === "/queue" && "hover:cursor-not-allowed"
        }`}
        key={song?.uri}
        onMouseOver={() => {
          currentSongPlaying
            ? setPlayButton(<BsPauseFill size={18} />)
            : setPlayButton(<BsPlayFill size={18} />);
        }}
        onMouseLeave={() => {
          currentSongPlaying
            ? setPlayButton(<WavebarIcon />)
            : setPlayButton(total as number);
        }}
        onDoubleClick={() => {
          playbackService.play.contextFn({
            device_id: device_id,
            context_uri: currentContext,
            offset: Number(total) - 1,
          });
        }}
      >
        <button
          className={`col-start-1 flex items-center justify-center cursor-pointer w-auto h-auto text-sm aspect-square transition-all ${
            location.pathname === "/queue" && "hover:cursor-not-allowed"
          }`}
          data-id={song?.uri}
          data-track-index={total}
          onClick={() => {
            console.warn(
              "Playing:",
              song?.name,
              "ID:",
              song?.id,
              "Offset:",
              Number(total) - 1,
              "Playlist:",
              currentContext
            );
            if (location.pathname !== "/queue") {
              playbackService.play.contextFn({
                device_id: device_id,
                context_uri: currentContext,
                offset: Number(total) - 1,
              });
            }
            if (playback?.is_playing && playback?.item?.id === song?.id) {
              player.togglePlay();
            }
          }}
        >
          {playButton}
        </button>
        <div className="ml-2 flex items-center gap-3 w-full">
          <img
            src={(song as Track)?.album?.images[1]?.url}
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
                "text-spotify"
              }`}
            >
              {song?.name}
            </p>
            <div>
              {song &&
                "artists" in song &&
                song?.artists.map((artist, i) => (
                  <Link
                    to={`/artist/${artist?.id}`}
                    className="hover:underline cursor-pointer hover:text-white text-gray-400"
                    key={artist?.id}
                  >
                    {song?.artists.length === i + 1
                      ? artist.name
                      : artist.name.concat(", ")}
                  </Link>
                ))}
            </div>
          </div>
        </div>
        <p className="col-start-3 opacity-60 hover:underline hover:opacity-90 cursor-pointer line-clamp-2 hidden lg:block">
          {song && "album" in song && song?.album?.name}
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
        <p className="relative col-start-5 cursor-default flex gap-2 items-center">
          <span className="absolute -left-10">
            {location.pathname === "/collection/liked" && (
              <Liked id={song?.id as string} />
            )}
            {location.pathname !== "/collection/liked" && (
              <Liked id={song?.id as string} />
            )}
          </span>
          <span className="opacity-60">
            {millisToMinutesAndSeconds(song?.duration_ms || 0)}
          </span>
        </p>
      </div>
    );
  }
}

export default PlaylistItem;
