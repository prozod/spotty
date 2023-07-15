import { useQuery } from "@tanstack/react-query";
import PlaylistItem from "../../components/Playlist/playlistitem.component";
import { playbackService } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import { Track } from "../../types/spotify";

function Queue() {
  const [playback] = usePlaybackStore((state) => [state.playback]);
  const { data: queue } = useQuery(
    [playbackService.playbackQueue.key],
    playbackService.playbackQueue.fn
  );

  return (
    <main className="flex gap-4 flex-col py-4 px-6">
      <h1 className="text-2xl font-bold tracking-wide">Queue</h1>
      {playback && (
        <section>
          <>
            <h1 className="text-white/60 text-sm mb-2 tracking-wide font-bold">
              Now playing
            </h1>
            <PlaylistItem
              track={playback?.item as Track}
              key={playback?.item?.id}
              total={1}
            />
          </>
          <>
            <h1 className="text-white/60 text-sm my-2 tracking-wide font-bold">
              Playing next
            </h1>
            {queue?.queue?.map((q, i) => (
              <PlaylistItem track={q as Track} key={q?.id} total={i + 2} />
            ))}
          </>
        </section>
      )}
    </main>
  );
}
export default Queue;
