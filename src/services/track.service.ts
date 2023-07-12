export async function getUserTopTracks() {
    const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
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

export async function getUserSavedTracks() {
    const response = await fetch("https://api.spotify.com/v1/me/tracks", {
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

export const trackService = {
    userTopTracks: { key: "user-top-tracks", fn: getUserTopTracks },
    userSavedTracks: { key: "user-saved-tracks", fn: getUserSavedTracks },
};
