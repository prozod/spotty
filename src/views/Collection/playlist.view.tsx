import { notifications } from "@mantine/notifications";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import PlaylistItem from "../../components/Playlist/playlistitem.component";
import Skeleton from "../../components/Skeleton/skeleton.component";
import { pausePlaying, playbackService } from "../../services/playback.service";
import { playlistService } from "../../services/playlist.service";
import usePlaybackStore from "../../store/playback.store";
import useUserStore from "../../store/user.store";
import { PlaylistTrack } from "../../types/spotify";
import getDominantColor from "../../utils/dominantColor";
import useDetermineLiked from "../../utils/useDetermineLiked";
const numFormat = new Intl.NumberFormat("en-US");

function Playlist() {
  const location = useLocation();
  const playlistId = location?.pathname?.split("/")[2] as string;
  const [bgColor, setBgColor] = useState<number[] | null>(null);
  const { ref, inView } = useInView();
  const [loggedIn, currentUser] = useUserStore(
    (state) => [state.loggedIn, state.currentUser],
    shallow
  );
  const pause = useMutation({ mutationFn: () => pausePlaying() });

  const {
    data: playlist,
    error,
    isLoading,
  } = useQuery(
    [playlistService.getPlaylist.key, playlistId],
    async () => playlistService.getPlaylist.fn({ id: playlistId }),
    {
      enabled: loggedIn,
    }
  );

  const [playback, player, device_id] = usePlaybackStore(
    (state) => [
      state.playback,
      state.player,
      state.device_id,
      state.likedTracks,
      state.likes,
    ],
    shallow
  );

  const RETURN_LIMIT = 50;
  const { data: tracks, fetchNextPage } = useInfiniteQuery(
    [playlistService.getPlaylistTracks.key, playlistId],
    async ({ pageParam = 0 }) =>
      playlistService.getPlaylistTracks.fn(playlistId, RETURN_LIMIT, pageParam),
    {
      enabled: loggedIn,
      getNextPageParam: (lastPage) => lastPage.offset + RETURN_LIMIT,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    async function playlistHeaderBgColor() {
      const data = await getDominantColor(playlist?.images[0]?.url as string);
      setBgColor(() => data);
    }
    playlistHeaderBgColor();
  }, [playlist]);

  // see which songs of the playlist are liked
  useDetermineLiked({ tracks: tracks, playlistId: playlist?.id as string });

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
          key={playlist?.id}
          className={`relative z-0 flex h-full  items-center gap-4 p-8 pt-24`}
          style={{
            backgroundColor: `rgb(${bgColor})`,
          }}
        >
          <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 to-transparent"></div>
          {playlist?.images && (
            <img
              src={playlist?.images[0]?.url}
              alt={(playlist?.owner?.display_name as string) || playlist?.id}
              width={250}
              height={250}
              className="z-10 aspect-square object-cover h-auto rounded-md"
            />
          )}
          <div className="z-10 flex h-[248px] grow flex-col justify-between gap-2">
            <div className="my-auto flex flex-col justify-center">
              {playlist?.public ? (
                <p className="text-xs ">PUBLIC PLAYLIST</p>
              ) : (
                <p className="text-xs ">
                  {playlist?.owner.id === "spotify"
                    ? "PUBLIC PLAYLIST"
                    : "PRIVATE PLAYLIST"}
                </p>
              )}
              <h1 className="md:text-2xl lg:text-4xl xl:text-6xl font-extrabold mt-2">
                {playlist?.name}
              </h1>
            </div>
            <div className="flex gap-2 flex-col">
              {playlist?.description && (
                <p className="text-xs lg:text-sm opacity-60 max-w-[30vw]">
                  {playlist?.description}
                </p>
              )}
              <div className="flex lg:items-center gap-2 text-sm flex-col lg:flex-row">
                <div className="flex gap-2">
                  <img
                    src={
                      playlist?.owner?.images
                        ? playlist?.images[0]?.url
                        : "/spotty.ico"
                    }
                    height={16}
                    width={16}
                    className="aspect-square rounded-full"
                  />
                  <p className="font-semibold">
                    {playlist?.owner?.display_name}
                  </p>
                </div>
                {playlist?.followers?.total > 0 && (
                  <>
                    <span className="text-xs hidden lg:block">•</span>
                    <p>{numFormat.format(playlist?.followers?.total)} likes</p>
                  </>
                )}
                <span className="text-xs hidden lg:block">•</span>
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
        <div className="flex items-center">
          {playback?.context?.uri === playlist?.uri && playback?.is_playing ? (
            <button
              className="bg-spotify rounded-full px-6 py-1 justify-center items-center flex  text-xs font-semibold  text-black z-10"
              onClick={() => pause.mutate()}
            >
              <BsPauseFill size={22} className="text-gray-800" />
              Pause
            </button>
          ) : (
            <button
              className="bg-spotify rounded-full px-6 py-1 justify-center items-center flex  text-xs font-semibold  text-black z-10"
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
                if (
                  playback?.context?.uri.split(":")[2] !==
                  location.pathname.split("/")[2]
                ) {
                  playbackService.play.contextFn({
                    device_id: device_id,
                    context_uri: playlist?.uri,
                    offset: 0,
                  });
                } else {
                  player.togglePlay();
                }
              }}
            >
              <BsPlayFill size={22} className="text-gray-800" />
              Play
            </button>
          )}
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
          <p className="col-start-3 hidden lg:block">Album</p>
          <p className="col-start-4 hidden lg:block">Date added</p>
          <p className="col-start-5 text-right lg:text-left">Length</p>
        </div>
        <div className="mb-4 h-[1px] w-full bg-white/10"></div>
        {isLoading &&
          Array.from({ length: 15 }, (_, i) => (
            <PlaylistItem key={i + "z"} loading={isLoading} />
          ))}

        {tracks?.pages.map((page) =>
          page?.items?.map((track: PlaylistTrack, i: number) => (
            <PlaylistItem
              playlistItem={track}
              key={track?.track?.id}
              total={page.offset + i + 1}
            />
          ))
        )}
        <span ref={ref} className="h-[1px] w-full bg-transparent"></span>
      </div>
    </section>
  );
}
export default Playlist;
