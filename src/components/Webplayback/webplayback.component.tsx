import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import usePlaybackStore from "../../store/playback.store";

function WebPlayback() {
    const [updatePlaybackState, updatePlayerSDK, updateIsActive] =
        usePlaybackStore(
            (state) => [
                state.updatePlaybackState,
                state.updatePlayerSDK,
                state.updateIsActive,
            ],
            shallow
        );

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
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
            });

            player.addListener(
                "not_ready",
                ({ device_id }: { device_id: string }) => {
                    console.log("Device ID has gone offline", device_id);
                }
            );

            player.addListener("player_state_changed", (state) => {
                if (!state) {
                    return;
                }

                updatePlaybackState(state);

                player.getCurrentState().then((state) => {
                    !state ? updateIsActive(false) : updateIsActive(true);
                });
            });

            player.connect();
        };
    }, []);

    return null;
}

export default WebPlayback;
