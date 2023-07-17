import { QueryClient, useMutation } from "@tanstack/react-query";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  addUserLikedTrack,
  deleteUserLikedTrack,
} from "../../services/track.service";
import usePlaybackStore from "../../store/playback.store";
import { playlistService } from "../../services/playlist.service";

function Liked({ id }: { id: string }) {
  const [likes] = usePlaybackStore((state) => [state.likes, state.updateLikes]);
  const queryClient = new QueryClient();

  const deleteLiked = useMutation({
    mutationFn: (id: string) => deleteUserLikedTrack(id),
  });
  const addLiked = useMutation({
    mutationFn: (id: string) => addUserLikedTrack(id),
  });
  console.log(likes);

  return (
    <>
      {likes.get(id) ? (
        <AiFillHeart
          className="text-spotify cursor-pointer hover:text-white transition-all"
          size={20}
          onClick={() => {
            deleteLiked.mutate(id as string);
            usePlaybackStore.setState((prev) => ({
              likes: new Map(prev.likes).set(id, true),
            }));
            queryClient.invalidateQueries([
              playlistService.getPlaylistTracks.key,
            ]);
          }}
        />
      ) : (
        <AiOutlineHeart
          size={20}
          className="hover:text-spotify transition-all cursor-pointer"
          onClick={() => {
            addLiked.mutate(id as string);
            queryClient.invalidateQueries([
              playlistService.getPlaylistTracks.key,
            ]);
          }}
        />
      )}
    </>
  );
}
export default Liked;
