import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import Tile from "../../components/Tile/tile.component";
import { artistService } from "../../services/artist.service";
import { trackService } from "../../services/track.service";
import useUserStore from "../../store/user.store";
import { Artist, Track } from "../../types/spotify";

function Recents() {
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);

  const { data: artists } = useQuery(
    [artistService.userTopArtists.key],
    artistService.userTopArtists.fn,
    {
      enabled: loggedIn,
    }
  );

  const { data: tracks } = useQuery(
    [trackService.userTopTracks.key],
    trackService.userTopTracks.fn,
    {
      enabled: loggedIn,
    }
  );
  return (
    <section className="m-6">
      <h1 className="font-bold">Recently played songs</h1>
      <div className="flex flex-wrap gap-2 mt-4">
        {(tracks?.items as Track[])?.map((track) => {
          return (
            <Tile
              key={track.id}
              title={track.artists[0].name}
              subtitle={track.name}
              image={track?.album?.images[1]?.url}
            />
          );
        })}
      </div>
      <h1 className="mt-10 font-bold">Recently played artists</h1>
      <div className="flex flex-wrap gap-2 mt-4">
        {(artists?.items as Artist[])?.map((artist) => {
          return (
            <Tile
              key={artist.id}
              title={`${
                artist?.genres.length > 0 ? artist?.genres[0].toUpperCase() : ""
              }`}
              subtitle={artist.name}
              image={artist?.images[1].url}
            />
          );
        })}
      </div>
    </section>
  );
}
export default Recents;
