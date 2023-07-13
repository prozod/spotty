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

export const userService = {
    userCredentials: { key: "user-credentials", fn: getUserCredentials },
};
