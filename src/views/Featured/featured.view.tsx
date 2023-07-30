import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import Card from "../../components/Card/card.component";
import { playlistService } from "../../services/playlist.service";
import { trackService } from "../../services/track.service";
import useUserStore from "../../store/user.store";
import { Album, SimplifiedPlaylist } from "../../types/spotify";

function Featured() {
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);
  const { data: featured } = useQuery(
    [playlistService.getFeatured.key],
    async () => playlistService.getFeatured.fn(),
    {
      enabled: loggedIn,
    }
  );
  const { data: releases } = useQuery(
    [trackService.newReleases.key],
    async () => trackService.newReleases.fn(),
    {
      enabled: loggedIn,
    }
  );

  return (
    <section className="m-6">
      <h1 className="font-bold">{featured?.message}</h1>
      <div className="flex gap-2 flex-wrap mt-2 mb-10">
        {featured?.playlists?.items?.map((item: SimplifiedPlaylist) => {
          return (
            <Card
              type={item?.type}
              id={item.id}
              key={item.id}
              title={item.name}
              subtitle={item.description as string}
              image={item?.images[0]?.url}
            />
          );
        })}
      </div>
      <h1 className="font-bold">New Releases</h1>
      <div className="flex gap-2 flex-wrap mt-2">
        {releases?.albums?.items?.map((item: Album) => {
          return (
            <Card
              type={item?.type}
              id={item.id}
              key={item.id}
              title={item.name}
              subtitle={item?.artists?.map((artist) => artist?.name).join(", ")}
              image={item?.images[0]?.url}
            />
          );
        })}
      </div>
    </section>
  );
}
export default Featured;
