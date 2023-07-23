import { shallow } from "zustand/shallow";
import usePlaybackStore from "../store/playback.store";
import { PlaylistTrack } from "../types/spotify";
import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { trackService } from "../services/track.service";

function useDetermineLiked(tracks, playlist) {
  const [playback, player, device_id, likedTracks] = usePlaybackStore(
    (state) => [
      state.playback,
      state.player,
      state.device_id,
      state.likedTracks,
      state.likes,
    ],
    shallow
  );
  const chunkSize = 50;
  const ch: string[][] = [];

  useEffect(() => {
    tracks?.pages.map((page) => {
      page?.items?.map((item: PlaylistTrack) =>
        usePlaybackStore.setState((prev) => ({
          likedTracks: new Map(prev.likedTracks).set(item?.track?.id, false),
        }))
      );
    });
  }, [tracks]);

  for (let i = 0; i < Array.from(likedTracks.keys()).length; i += chunkSize) {
    const chunk = Array.from(likedTracks.keys()).slice(i, i + chunkSize);
    ch.push(chunk);
  }

  const likeQueries = useQueries({
    queries: ch.map((_c, i) => {
      return {
        queryKey: [trackService.userLikedTracks.key, playlist?.id as string, i],
        queryFn: () => trackService.userLikedTracks.fn(ch[i]),
      };
    }),
  });

  const allFinished = likeQueries.every((query) => query.isSuccess);

  useEffect(() => {
    if (allFinished) {
      likeQueries?.map(async (query, idx) => {
        for (let i = 0; i < chunkSize; i++) {
          {
            query?.data !== undefined;
            usePlaybackStore.setState((prev) => ({
              likes: new Map(prev.likes).set(ch[idx][i], query?.data[i]),
            }));
          }
        }
      });
    }
  }, [allFinished]);

  return null;
}
export default useDetermineLiked;
