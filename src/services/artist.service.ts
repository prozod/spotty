export async function getUserTopArtists() {
  const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}
export const artistService = {
  userTopArtists: { key: "user-top-artists", fn: getUserTopArtists },
};
