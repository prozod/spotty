import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { shallow } from "zustand/shallow";
import Card from "../../components/Card/card.component";
import Header from "../../components/Header/header.component";
import Player from "../../components/Player/player.component";
import Sidebar from "../../components/Sidebar/sidebar.component";
import WebPlayback from "../../components/Webplayback/webplayback.component";
import { trackService } from "../../services/track.service";
import usePlaybackStore from "../../store/playback.store";
import useUserStore from "../../store/user.store";
import { Track } from "../../types/spotify";

function Home() {
  const location = useLocation();
  const [loggedIn, updateSavedTracks] = useUserStore(
    (state) => [state.loggedIn, state.updateSavedTracks],
    shallow
  );

  const [device_id, devices, playback] = usePlaybackStore(
    (state) => [state.device_id, state.devices, state.playback],
    shallow
  );

  const { data } = useQuery(
    [trackService.userTopTracks.key],
    trackService.userTopTracks.fn,
    {
      enabled: loggedIn,
    }
  );

  useEffect(() => {
    updateSavedTracks(data?.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loggedIn]);

  return (
    <>
      <WebPlayback />
      <main
        className={`grid h-screen w-screen grid-cols-appLayout grid-rows-1 relative`}
      >
        <div
          className={`relative rounded-md bg-transparent resize-x  w-[280px] max-w-[500px] overflow-x-auto`}
        >
          <Sidebar />
        </div>
        <div
          className={`bg-gradient-to-tr from-grack-900 to-black relative overflow-x-auto border-l-[1px] border-grack-800 min-w-[550px]`}
        >
          <Header />
          {location.pathname === "/" && (
            <section className="flex flex-col m-4 ">
              <h1 className="mb-4 text-xl font-bold text-gray-300">
                Recently played
              </h1>
              <div className="grid self-start grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
                {(data?.items as Track[])?.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      title={item.artists[0].name}
                      subtitle={item.name}
                      image={item?.album?.images[1]?.url}
                    />
                  );
                })}
              </div>
            </section>
          )}
          {location.pathname !== "/" && <Outlet />}
        </div>
        <div className="pb-3 col-span-full border-t-[1px] border-grack-800">
          <Player />
        </div>

        {!devices?.devices.find((dev) => dev.id === device_id)?.is_active &&
          playback?.is_playing && (
            <div className="flex items-center justify-end h-[24px] px-2 text-xs font-semibold  text-black bg-spotify justify-right col-span-full">
              <p className="flex items-center gap-2 mr-4">
                <svg
                  role="presentation"
                  height="16"
                  width="16"
                  aria-hidden="true"
                  className=""
                  viewBox="0 0 16 16"
                  data-encore-id="icon"
                >
                  <path d="M14.5 8a6.468 6.468 0 0 0-1.3-3.9l1.2-.9C15.405 4.537 16 6.2 16 8c0 1.8-.595 3.463-1.6 4.8l-1.2-.9A6.468 6.468 0 0 0 14.5 8zM8 1.5a6.5 6.5 0 1 0 3.25 12.13.75.75 0 1 1 .75 1.3 8 8 0 1 1 0-13.86.75.75 0 1 1-.75 1.298A6.467 6.467 0 0 0 8 1.5z"></path>
                  <path d="M11.259 8c0-.676-.228-1.296-.611-1.791l1.187-.918c.579.749.924 1.69.924 2.709a4.41 4.41 0 0 1-.925 2.709l-1.186-.918c.383-.495.61-1.115.61-1.791zM8.75 4.115l-4.139 2.39a1.727 1.727 0 0 0 0 2.99l4.139 2.39v-7.77z"></path>
                </svg>
                Listening on{" "}
                {devices?.devices.find((dev) => dev.is_active)?.name}
              </p>
            </div>
          )}
      </main>
    </>
  );
}

export default Home;
//col-start-4 lg:col-start-3 xl:col-start-2
