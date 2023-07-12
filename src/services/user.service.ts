import { CurrentlyPlaying, Track } from "../types/spotify";

export async function getUserCredentials() {
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
    });
    if (!response.ok) {
        throw new Error(
            "Network response to/from 'http://localhost:3000' was not ok"
        );
    }
    return response.json();
}

export async function getUserPlaybackState() {
    const response = await fetch(
        "https://api.spotify.com/v1/me/player?additional_types=episode",
        {
            headers: {
                Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error(
            "Network response to/from 'http://localhost:3000' was not ok"
        );
    }
    return response.json() as Promise<CurrentlyPlaying<Track>>;
}

export async function getUserDevices() {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: {
            Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
    });
    if (!response.ok) {
        throw new Error(
            "Network response to/from 'http://localhost:3000' was not ok"
        );
    }
    return response.json();
}

export const transferPlayback = ({ device_id }: { device_id: string }) => {
    fetch(`https://api.spotify.com/v1/me/player`, {
        method: "PUT",
        body: JSON.stringify({
            device_ids: [device_id?.toString()],
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
    });
};

export const toggleShuffle = ({
    device_id,
    state,
}: {
    device_id?: string;
    state: boolean;
}) => {
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
        method: "PUT",
        body: JSON.stringify({
            device_id: device_id?.toString(),
        }),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
        },
    });
};

export const userService = {
    userCredentials: { key: "user-credentials", fn: getUserCredentials },
    userPlaybackState: { key: "user-playback-state", fn: getUserPlaybackState },
    userDevices: { key: "user-devices", fn: getUserDevices },
};
