export async function getUserTopTracks() {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export async function getUserSavedAlbums() {
  const response = await fetch(
    "https://api.spotify.com/v1/me/albums?limit=30",
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

export async function getUserSavedShows() {
  const response = await fetch("https://api.spotify.com/v1/me/shows?limit=30", {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json();
}

export async function getNewReleases() {
  const response = await fetch(
    "https://api.spotify.com/v1/browse/new-releases",
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

export async function getUserSavedTracks(limit: number, offset: number) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
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

export async function getUserLikedTracks(id: string[]) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`,
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

export async function deleteUserLikedTrack(id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${id}`,
    {
      method: "DELETE",
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

export async function addUserLikedTrack(id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${id}`,
    {
      method: "PUT",
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

export const trackService = {
  userTopTracks: { key: "user-top-tracks", fn: getUserTopTracks },
  userSavedTracks: { key: "user-saved-tracks", fn: getUserSavedTracks },
  userLikedTracks: { key: "user-likes-", fn: getUserLikedTracks },
  newReleases: { key: "new-releases", fn: getNewReleases },
  savedAlbums: { key: "saved-albums", fn: getUserSavedAlbums },
  savedShows: { key: "saved-shows", fn: getUserSavedShows },
};
