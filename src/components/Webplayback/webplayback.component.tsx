import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { playbackService } from "../../services/playback.service";
import usePlaybackStore from "../../store/playback.store";
import { WebPlaybackStateObject } from "../../types/spotify";

function WebPlayback() {
  const queryClient = useQueryClient();
  const [
    updateWebSDKPlayback,
    updatePlayerSDK,
    updateIsActive,
    updateDeviceId,
  ] = usePlaybackStore(
    (state) => [
      state.updateWebSDKPlayback,
      state.updatePlayerSDK,
      state.updateIsActive,
      state.updateDeviceId,
    ],
    shallow
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotty - Web Playback",
        getOAuthToken: (cb: any) => {
          cb(document.cookie.split("access_token=")[1]);
        },
        volume: 0.5,
      });

      updatePlayerSDK(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        queryClient.invalidateQueries([playbackService.devices.key]);
        updateDeviceId(device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
          queryClient.invalidateQueries([playbackService.devices.key]);
          queryClient.invalidateQueries([playbackService.playbackState.key]);
        }
      );

      player.addListener(
        "player_state_changed",
        (state: WebPlaybackStateObject) => {
          if (!state) {
            return;
          }

          console.log("STATE CHANGED - PLAYER EVENT");
          queryClient.invalidateQueries([playbackService.devices.key]);
          queryClient.invalidateQueries([playbackService.playbackState.key]);
          queryClient.invalidateQueries([playbackService.playbackQueue.key]);

          updateWebSDKPlayback(state);

          player.getCurrentState().then((state: WebPlaybackStateObject) => {
            !state ? updateIsActive(false) : updateIsActive(true);
          });
        }
      );

      player.connect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default WebPlayback;
