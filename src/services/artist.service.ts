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

export async function getArtistById(id: string) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export async function getArtistTopTracks(id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export async function getArtistTopAlbums(id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/albums?market=US`,
    {
      headers: {
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export const artistService = {
  userTopArtists: { key: "user-top-artists", fn: getUserTopArtists },
  getArtist: { key: "artist", fn: getArtistById },
  getTopTracks: { key: "top-tracks", fn: getArtistTopTracks },
  getTopAlbums: { key: "top-albums", fn: getArtistTopAlbums },
};
