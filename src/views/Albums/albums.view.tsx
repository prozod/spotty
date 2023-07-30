import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import Card from "../../components/Card/card.component";
import { trackService } from "../../services/track.service";
import useUserStore from "../../store/user.store";
import { Album } from "../../types/spotify";

function Albums() {
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);
  const { data: albums } = useQuery(
    [trackService.savedAlbums.key],
    trackService.savedAlbums.fn,
    {
      enabled: loggedIn,
    }
  );
  console.log(albums);
  return (
    <section className="m-6">
      <h1 className="font-bold mb-4">Saved albums</h1>
      <div className="flex flex-wrap gap-2 relative overflow-hidden">
        {albums?.items?.map(({ album }: { album: Album }) => {
          return (
            <Card
              key={album.id}
              title={album.name}
              subtitle={album?.artists
                ?.map((artist) => artist?.name)
                .join(", ")}
              image={album?.images[0]?.url}
            />
          );
        })}
      </div>
    </section>
  );
}
export default Albums;
