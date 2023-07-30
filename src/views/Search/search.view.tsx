import { Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card/card.component";
import Tile from "../../components/Tile/tile.component";
import { userService } from "../../services/user.service";
import useUserStore from "../../store/user.store";
import { Album, Artist, SimplifiedPlaylist, Track } from "../../types/spotify";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchResults] = useUserStore((state) => [state.searchResults]);

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setQuery(searchResults);
    }, 150);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchResults]);

  const {
    data: results,
    isSuccess,
    isError,
    isFetching,
  } = useQuery(
    [userService.search.key.concat(query)],
    async () => userService.search.fn({ query: query }),
    { enabled: query?.length > 1 }
  );

  console.log(results, query);
  return (
    <section className="m-6">
      {isError && (
        <p className="text-2xl text-gray-400 w-full py-12 mx-auto flex items-center justify-center">
          Woops, something went wrong! Please try again.
        </p>
      )}
      {isFetching && (
        <div className="text-2xl text-gray-400 w-full py-12 mx-auto flex items-center justify-center">
          <Loader color="#1ed760" variant="dots" size="xl" />
        </div>
      )}
      {!isSuccess && !isFetching && (
        <p className="text-2xl text-gray-400 w-full py-12 mx-auto flex items-center justify-center">
          Search for something...
        </p>
      )}

      {isSuccess && (
        <div className="flex flex-col gap-8">
          <>
            <h1 className="font-bold">Songs</h1>
            <div className="flex flex-wrap gap-2">
              {(results?.tracks?.items as Track[])?.map((track) => {
                return (
                  <Tile
                    key={track.id}
                    type={track.type}
                    songUri={track?.uri}
                    title={track.artists[0].name}
                    subtitle={track.name}
                    image={track?.album?.images[1]?.url}
                  />
                );
              })}
            </div>
          </>
          <>
            <h1 className="font-bold">Artists</h1>
            <div className="flex flex-wrap gap-2">
              {(results?.artists?.items as Artist[])?.map((artist) => {
                return (
                  <Link to={`/artist/${artist.id}`}>
                    <Tile
                      key={artist.id}
                      title={`Followers: ${new Intl.NumberFormat(
                        "en-US"
                      ).format(artist?.followers?.total)}`}
                      subtitle={artist.name}
                      image={artist?.images[0]?.url}
                    />
                  </Link>
                );
              })}
            </div>
          </>
          <>
            <h1 className="font-bold">Albums</h1>
            <div className="flex flex-wrap gap-2">
              {(results?.albums?.items as Album[])?.map((album) => {
                return (
                  <Card
                    type={album?.type}
                    key={album.id}
                    title={album.artists[0].name}
                    subtitle={album.name}
                    image={album?.images[1]?.url}
                  />
                );
              })}
            </div>
          </>
          <>
            <h1 className="font-bold">Playlists</h1>
            <div className="flex flex-wrap gap-2">
              {(results?.playlists?.items as SimplifiedPlaylist[])?.map(
                (playlist) => {
                  return (
                    <Card
                      type={playlist?.type}
                      id={playlist?.id}
                      key={playlist.id}
                      title={playlist?.owner?.display_name as string}
                      subtitle={playlist.name}
                      image={playlist?.images[0]?.url}
                    />
                  );
                }
              )}
            </div>
          </>
        </div>
      )}
    </section>
  );
}
