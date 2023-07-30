import { Carousel } from "@mantine/carousel";
import { useQuery } from "@tanstack/react-query";
import { AiFillCheckCircle } from "react-icons/ai";
import { shallow } from "zustand/shallow";
import { artistService } from "../../services/artist.service";
import useUserStore from "../../store/user.store";
import { Album, Track } from "../../types/spotify";
import Tile from "../../components/Tile/tile.component";
import Card from "../../components/Card/card.component";

function Artist() {
  const artistId = location?.pathname?.split("/")[2] as string;
  const [loggedIn] = useUserStore((state) => [state.loggedIn], shallow);

  const { data: artist } = useQuery(
    [artistService.getArtist.key, artistId],
    async () => artistService.getArtist.fn(artistId),
    {
      enabled: loggedIn,
    }
  );
  const { data: toptracks } = useQuery(
    [artistService.getTopTracks.key, artistId],
    async () => artistService.getTopTracks.fn(artistId),
    {
      enabled: loggedIn,
    }
  );
  const { data: topalbums } = useQuery(
    [artistService.getTopAlbums.key, artistId],
    async () => artistService.getTopAlbums.fn(artistId),
    {
      enabled: loggedIn,
    }
  );

  return (
    <section className="flex flex-col">
      <div
        className="relative bg-cover bg-center -top-24 flex items-end p-8"
        style={{
          backgroundImage: `url(${artist?.images[0].url})`,
          width: "100%",
          height: "450px",
        }}
      >
        <div className="flex flex-col gap-4 z-10">
          <div className="flex  items-center gap-2 w-full">
            <AiFillCheckCircle className="text-blue-400 w-fit" size={24} />
            <span>Verified Artist</span>
          </div>
          <h1 className="text-7xl font-black">{artist?.name}</h1>
          <p className="text-md">
            {new Intl.NumberFormat("en-US").format(artist?.followers?.total)}{" "}
            followers
          </p>
        </div>
        <span className="w-full h-full bg-black absolute inset-0 z-0 opacity-50"></span>
      </div>
      <div className="relative w-full -top-24">
        <p className="z-50 w-full px-8 py-4 bg-spotify text-black font-medium text-center">
          Since Spotify might not even extend my quota for the API usage, I
          didn't bother implementing certain pages to completion.
        </p>
      </div>
      <div className="relative -top-24 m-8">
        <h1 className="font-bold mb-4">Top Songs</h1>
        <div className="flex flex-wrap gap-2">
          {toptracks?.tracks?.map((track: Track) => {
            return (
              <Tile
                key={track.id}
                songUri={track.uri}
                type={track.type}
                subtitle={track?.name}
                title={track?.artists.map((artist) => artist.name).join()}
                image={track?.album?.images[0]?.url}
              />
            );
          })}
        </div>
      </div>
      <div className="relative -top-20 m-8 mr-8">
        <h1 className="font-bold mb-4">{artist?.name} Albums</h1>
        <Carousel
          slideSize="12.5%"
          slidesToScroll={2}
          slideGap={8}
          align="start"
          withControls={false}
        >
          {topalbums?.items?.map((album: Album) => {
            return (
              <Carousel.Slide className="flex">
                <Card
                  key={album?.id}
                  type={album?.type}
                  subtitle={album?.name}
                  title={album?.artists
                    .map((artist) => artist?.name)
                    .join(", ")}
                  image={album?.images[0]?.url}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}
export default Artist;
