import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import PlaylistItem from "../../components/Playlist/playlistitem.component";
import Skeleton from "../../components/Skeleton/skeleton.component";
import { playlistService } from "../../services/playlist.service";
import usePlaybackStore from "../../store/playback.store";
import usePlaylistStore from "../../store/playlist.store";
import { PlaylistTrack } from "../../types/spotify";
import getDominantColor from "../../utils/dominantColor";

const numFormat = new Intl.NumberFormat("en-US");

function Playlist() {
  const location = useLocation();
  const playlistId = location?.pathname?.split("/")[2] as string;
  const [bgColor, setBgColor] = useState<number[] | null>(null);

  const {
    data: playlist,
    error,
    isLoading,
  } = useQuery([playlistService.getPlaylist.key.concat(playlistId)], async () =>
    playlistService.getPlaylist.fn({ id: playlistId })
  );
  const [playback] = usePlaybackStore((state) => [state.playback], shallow);

  useEffect(() => {
    usePlaylistStore.setState({ playlist: playlist });
  }, [playlist]);

  useEffect(() => {
    async function playlistHeaderBgColor() {
      const data = await getDominantColor(playlist?.images[0]?.url as string);
      setBgColor(() => data);
    }
    playlistHeaderBgColor();
  }, [playlist]);

  // const currentlyPlayingBelongsToPlaylist = playlist?.tracks.items.includes(
  //   (track) => (track.track?.id === playback?.item?.id ? true : false)
  // );

  return (
    <section className="absolute top-0 flex flex-col bg-black">
      {isLoading && (
        <div
          className={`relative z-0 flex h-full  items-center gap-4 p-8 pt-24`}
          style={{
            backgroundColor: "rgba(40, 40, 40, 1)",
          }}
        >
          <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 to-transparent"></div>
          <Skeleton height="250px" width="250px" />
          <div className="z-10 flex h-[248px] grow flex-col justify-between gap-2 font-inter">
            <div className="my-auto flex flex-col justify-center gap-2">
              <p className="text-xs ">
                <Skeleton height="20px" width="150px" />
              </p>
              <h1 className="text-6xl font-extrabold">
                <Skeleton height="50px" width="300px" />
              </h1>
            </div>
            <div className="flex gap-2 flex-col">
              <p className="text-sm opacity-60 max-w-[30vw]">
                <Skeleton height="10px" width="300px" />
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Skeleton height="16px" width="16px" />
                <Skeleton height="16px" width="276px" />
              </div>
            </div>
          </div>
        </div>
      )}
      {playlist && (
        <div
          key={playlist.id}
          className={`relative z-0 flex h-full  items-center gap-4 p-8 pt-24`}
          style={{
            backgroundColor: `rgb(${bgColor})`,
          }}
        >
          <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 to-transparent"></div>
          {playlist.images && (
            <img
              src={playlist?.images[0]?.url}
              width={250}
              height={250}
              alt={playlist.id}
              className="z-10 aspect-square h-auto rounded-md"
            />
          )}
          <div className="z-10 flex h-[248px] grow flex-col justify-between gap-2 font-inter">
            <div className="my-auto flex flex-col justify-center">
              {playlist?.public ? (
                <p className="text-xs ">PUBLIC PLAYLIST</p>
              ) : (
                <p className="text-xs ">PRIVATE PLAYLIST</p>
              )}
              <h1 className="text-6xl font-extrabold">{playlist.name}</h1>
            </div>
            <div className="flex gap-2 flex-col">
              {playlist.description && (
                <p className="text-sm opacity-60 max-w-[30vw]">
                  {playlist.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <img
                  src={
                    playlist?.owner?.images
                      ? playlist?.owner?.images[0].url
                      : "/spotty.ico"
                  }
                  height={16}
                  width={16}
                  className="rounded-full"
                />
                <p className="font-semibold">{playlist?.owner?.display_name}</p>
                {playlist?.followers?.total > 0 && (
                  <>
                    <span className="text-xs">•</span>
                    <p>{numFormat.format(playlist?.followers?.total)} likes</p>
                  </>
                )}
                <span className="text-xs">•</span>
                <p className="">{playlist?.tracks?.total} songs</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <aside className="relative flex w-full items-center justify-between px-8 py-4 ">
        <div
          className="absolute inset-0 h-[350px] w-full"
          style={{
            background: `linear-gradient(
      to bottom,
      rgba(${isLoading ? "40, 40, 40, 1" : bgColor}, 0.19),
      rgba(9, 9, 11, 0.25) 90.71%
    )`,
          }}
        ></div>
        <div className="flex">
          <span
            className="z-10 h-fit w-fit cursor-pointer rounded-full bg-green-400"
            // onClick={() => {
            //     playback?.context?.uri === playlist?.uri && playback?.is_playing
            //         ? pauseSong.mutate()
            //         : playContext({
            //             access_token: accessToken!,
            //             context_uri: playlist?.uri,
            //             offset: 0,
            //         });
            // }}
          >
            {playback?.context?.uri === playlist?.uri &&
            playback?.is_playing ? (
              <button className="px-6 py-2 justify-center items-center flex leading-4 text-xs font-semibold gap-2 text-black">
                <FaPause />
                Pause
              </button>
            ) : (
              <button className="px-6 py-2 justify-center items-center flex leading-4 text-xs font-semibold gap-2 text-black">
                <FaPlay />
                Play
              </button>
            )}
          </span>
        </div>
        <div className="z-10 flex items-center gap-4">
          <FiSearch className="text-gray-400" size={20} />
          <span className="leading-2 flex items-center justify-center gap-1 text-xs text-gray-400">
            Custom order
            <FiChevronDown size={18} className="leading-4" />
          </span>
        </div>
      </aside>
      {error && (
        <p>Something went wrong while getting the songs, please try again.</p>
      )}
      <div className="z-10 mx-8 mb-2 bg-transparent">
        <div className="grid w-full grid-cols-playlist items-center px-4 py-2 font-inter text-sm opacity-60 transition-all hover:bg-white/10">
          <p className="col-start-1">#</p>
          <p className="col-start-2">Title</p>
          <p className="col-start-3">Album</p>
          <p className="col-start-4">Date added</p>
          <p className="col-start-5">Length</p>
        </div>
        <div className="mb-4 h-[1px] w-full bg-white/10"></div>
        {isLoading &&
          Array.from({ length: 15 }, (_, i) => (
            <PlaylistItem key={i + "z"} loading={isLoading} />
          ))}

        {/*{tracks?.pages.map((page) =>
                    page?.items?.map((track, i) => (
                        <TableItem
                            playlistContext={playlist}
                            playlistItem={track as PlaylistTrack}
                            key={track?.track?.id}
                            total={page.offset + i + 1}
                        />
                    ))
                )}*/}
        {playlist?.tracks?.items?.map((track, i) => (
          <PlaylistItem
            playlistContext={playlist}
            playlistItem={track as PlaylistTrack}
            key={track?.track?.id}
            total={i + 1}
          />
        ))}
        {/*<span ref={ref} className="h-[1px] w-full bg-transparent"></span>*/}
      </div>
    </section>
  );
}
export default Playlist;
