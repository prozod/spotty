import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { playlistService } from "../../services/playlist.service";
import {
  addUserLikedTrack,
  deleteUserLikedTrack,
  trackService,
} from "../../services/track.service";
import usePlaybackStore from "../../store/playback.store";

function Liked({ id, saved }: { id: string; saved?: boolean }) {
  const [likes] = usePlaybackStore((state) => [state.likes, state.playback]);
  const queryClient = useQueryClient();

  const deleteLiked = useMutation({
    mutationFn: (id: string) => deleteUserLikedTrack(id),
  });

  const addLiked = useMutation({
    mutationFn: (id: string) => addUserLikedTrack(id),
  });

  if (saved) {
    return (
      <AiFillHeart
        className="text-spotify cursor-pointer hover:text-white transition-all"
        size={20}
        onClick={() => {
          deleteLiked.mutate(id as string);
          queryClient.invalidateQueries([trackService.userSavedTracks.key]);
          queryClient.refetchQueries([trackService.userSavedTracks.key]);
          queryClient.invalidateQueries([trackService.userLikedTracks.key]);
          console.log("Deleted", id, "Invalidated", [
            trackService.userSavedTracks.key,
          ]);
          usePlaybackStore.setState((prev) => ({
            likes: new Map(prev.likes).set(id, false),
          }));
        }}
      />
    );
  }

  return (
    <>
      {likes.get(id) ? (
        <AiFillHeart
          className="text-spotify cursor-pointer hover:text-white transition-all"
          size={20}
          onClick={() => {
            deleteLiked.mutate(id as string);
            queryClient.invalidateQueries([trackService.userSavedTracks.key]);
            queryClient.refetchQueries([trackService.userSavedTracks.key]);
            queryClient.invalidateQueries([
              trackService.userLikedTracks.key,
              id,
            ]);
            queryClient.invalidateQueries([
              playlistService.getPlaylistTracks.key,
            ]);
            usePlaybackStore.setState((prev) => ({
              likes: new Map(prev.likes).set(id, false),
            }));
          }}
        />
      ) : (
        <AiOutlineHeart
          size={20}
          className="hover:text-spotify transition-all cursor-pointer"
          onClick={() => {
            addLiked.mutate(id as string);
            queryClient.invalidateQueries([trackService.userSavedTracks.key]);
            queryClient.refetchQueries([trackService.userSavedTracks.key]);
            queryClient.invalidateQueries([
              trackService.userLikedTracks.key,
              id,
            ]);
            queryClient.invalidateQueries([
              playlistService.getPlaylistTracks.key,
            ]);
            usePlaybackStore.setState((prev) => ({
              likes: new Map(prev.likes).set(id, true),
            }));
          }}
        />
      )}
    </>
  );
}
export default Liked;
