import {
  Paging,
  Playlist,
  PublicUser,
  SimplifiedPlaylist,
} from "../types/spotify";
import { pageIterator } from "../utils/pageIterator";

export async function getCurrentUserPlaylists() {
  const playlistsArr: {
    name: string;
    id: string;
    context: string;
    images: { height: number | null; width: number | null; url: string }[];
    type: string;
    owner: PublicUser;
  }[] = [];
  const endpoint = `https://api.spotify.com/v1/me/playlists?offset=${0}&limit=${10}`;
  const data = pageIterator<Paging<SimplifiedPlaylist>>(
    endpoint,
    document.cookie.split("access_token=")[1]
  );

  for await (const playlists of data) {
    for (const playlist of playlists.items) {
      playlistsArr.push({
        name: playlist.name,
        id: playlist.id,
        context: playlist?.uri,
        images: playlist?.images,
        owner: playlist?.owner,
        type: playlist?.type,
      });
    }
  }

  return playlistsArr;
}

export async function getPlaylistTracks(
  id: string,
  limit: number,
  offset: number
) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
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

export async function getPlaylist({ id }: { id: string }) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response to/from Spotty Backend was not ok");
  }
  return response.json() as Promise<Playlist>;
}

export const playlistService = {
  currentUserPlaylists: {
    key: "current-user-playlists",
    fn: getCurrentUserPlaylists,
  },
  getPlaylistTracks: {
    key: "playlist-tracks-",
    fn: getPlaylistTracks,
  },
  getPlaylist: {
    key: "playlist-",
    fn: getPlaylist,
  },
};
