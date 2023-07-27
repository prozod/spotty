import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { BsPauseFill, BsPlayFill, BsSearch } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { RxHeartFilled } from "react-icons/rx";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import PlaylistItem from "../../components/Playlist/playlistitem.component";
import Skeleton from "../../components/Skeleton/skeleton.component";
import { pausePlaying, playbackService } from "../../services/playback.service";
import { trackService } from "../../services/track.service";
import usePlaybackStore from "../../store/playback.store";
import useUserStore from "../../store/user.store";
import { PlaylistTrack } from "../../types/spotify";
import useDetermineLiked from "../../utils/useDetermineLiked";

export default function CollectionLiked() {
  const location = useLocation();
  const { ref, inView } = useInView();
  const [playback, player, device_id] = usePlaybackStore(
    (state) => [state.playback, state.player, state.device_id],
    shallow
  );
  const [loggedIn, currentUser] = useUserStore(
    (state) => [state.loggedIn, state.currentUser],
    shallow
  );

  const RETURN_LIMIT = 50;
  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery(
    [trackService.userSavedTracks.key],
    async ({ pageParam = 0 }) =>
      trackService.userSavedTracks.fn(RETURN_LIMIT, pageParam),
    {
      refetchOnMount: "always",
      enabled: loggedIn,
      getNextPageParam: (lastPage) => lastPage.offset + RETURN_LIMIT,
    }
  );

  useDetermineLiked({
    tracks: data,
    playlistId: "likes",
    triggerState: playback?.context?.uri ? true : false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const pause = useMutation({ mutationFn: () => pausePlaying() });

  return (
    <section className="absolute top-0 flex flex-col bg-black">
      {!error && (
        <div
          className={`relative z-0 flex h-full w-full items-center gap-4 bg-indigo-500 px-8 pb-8 pt-28`}
        >
          <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 to-transparent"></div>
          <span className="flex h-[250px] w-[250px] items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-400 aspect-square  shadow-sm">
            <RxHeartFilled className="z-10 p-1 text-white" size={96} />
          </span>
          <div className="z-10 flex h-[248px] grow flex-col justify-between gap-2 font-inter">
            <div className="my-auto flex flex-col justify-center">
              <p className="text-xs font-semibold">PLAYLIST</p>
              <h1 className="md:text-5xl lg:text-6xl font-extrabold">
                Liked Songs
              </h1>
            </div>
            <div className="">
              <div className="flex items-center gap-2 text-sm">
                {isLoading ? (
                  <Skeleton width="200px" height="15px" />
                ) : (
                  <>
                    <img
                      src={currentUser?.images[0]?.url}
                      alt={currentUser?.name}
                      height={16}
                      width={16}
                      className="aspect-square rounded-full"
                    />
                    <p className="font-semibold">{currentUser?.display_name}</p>
                    <span className="text-xs">•</span>
                    <p className="">{data?.pages[0]?.total} songs</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <aside className="relative flex w-full items-center justify-between px-8 py-4 ">
        <div className="absolute inset-0 h-[350px] w-full bg-gradient-to-b from-indigo-500/20 to-black"></div>
        <div className="flex items-center">
          {playback?.context?.uri ===
            `spotify:user:${currentUser?.id}:collection` &&
          playback?.is_playing ? (
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
                if (
                  !playback?.context?.uri &&
                  location?.pathname === "/collection/liked"
                ) {
                  playbackService.play.contextFn({
                    device_id: device_id,
                    context_uri: `spotify:user:${currentUser.id}:collection`,
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
          <BsSearch className="text-gray-400" size={20} />
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
        <div className="grid w-full grid-cols-playlistMobile lg:grid-cols-playlist items-center px-4 py-2 text-sm opacity-60 transition-all hover:bg-white/10">
          <p className="col-start-1">#</p>
          <p className="col-start-2">Title</p>
          <p className="hidden lg:block col-start-3">Album</p>
          <p className="hidden lg:block col-start-4">Date added</p>
          <p className="col-start-5">Length</p>
        </div>
        <div className="mb-4 h-[1px] w-full bg-white/10"></div>
        {isLoading &&
          Array.from({ length: 15 }, (_, i) => (
            <PlaylistItem key={i + "z"} loading={isLoading} />
          ))}
        {data?.pages?.map((page) => {
          return page?.items.map((item: PlaylistTrack, i: number) => {
            return (
              <PlaylistItem
                playlistItem={item}
                key={item?.track?.id}
                total={page?.offset + i + 1}
              />
            );
          });
        })}
        <span ref={ref} className="h-[50px] w-full bg-red-200"></span>
      </div>
    </section>
  );
}
