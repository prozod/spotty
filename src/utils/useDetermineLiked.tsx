import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { trackService } from "../services/track.service";
import usePlaybackStore from "../store/playback.store";
import { PlaylistTrack, UserPlaylistPaged } from "../types/spotify";

function useDetermineLiked({
  tracks,
  playlistId,
  triggerState,
}: {
  tracks?: UserPlaylistPaged;
  playlistId: string;
  triggerState?: boolean;
}) {
  const [likedTracks] = usePlaybackStore(
    (state) => [state.likedTracks],
    shallow
  );
  const chunkSize = 50;
  const ch: string[][] = [];
  tracks && console.log(tracks);

  useEffect(() => {
    tracks?.pages.map((page) => {
      page?.items?.map((item: PlaylistTrack) => {
        usePlaybackStore.setState((prev) => ({
          likedTracks: new Map(prev.likedTracks).set(item?.track?.id, false),
        }));
      });
    });
  }, [tracks, triggerState]);

  for (let i = 0; i < Array.from(likedTracks.keys()).length; i += chunkSize) {
    const chunk = Array.from(likedTracks.keys()).slice(i, i + chunkSize);
    ch.push(chunk);
  }

  const likeQueries = useQueries({
    queries: ch.map((_c, i) => {
      return {
        queryKey: [trackService.userLikedTracks.key, playlistId, i],
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
