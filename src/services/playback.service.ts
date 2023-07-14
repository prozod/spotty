import { CurrentlyPlaying, Devices, Episode, Track } from "../types/spotify";

export async function getPlaybackState() {
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
  return response.json() as Promise<CurrentlyPlaying<Track | Episode>>;
}

export async function getDevices() {
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
  return response.json() as Promise<Devices>;
}

export const transferPlayback = async ({
  device_id,
}: {
  device_id: string;
}) => {
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

export const toggleShuffle = async ({
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

export const playSong = ({
  spotify_uri,
  device_id,
  position_ms,
}: {
  spotify_uri?: string | null;
  device_id?: string;
  position_ms?: number;
}) => {
  fetch(
    `https://api.spotify.com/v1/me/player/play${
      device_id ? "?device_id=" + device_id : ""
    }`,
    {
      method: "PUT",
      body: JSON.stringify({
        uris: [spotify_uri] || null,
        position_ms: position_ms,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    }
  );
};
export const playContext = ({
  offset,
  device_id,
  context_uri,
  progress,
}: {
  device_id?: string | null;
  offset?: number | null;
  progress?: number | null;
  context_uri?: string | null;
}) => {
  fetch(
    `https://api.spotify.com/v1/me/player/play${
      device_id ? "?device_id=" + device_id : ""
    }`,
    {
      method: "PUT",
      body: JSON.stringify({
        context_uri: context_uri,
        offset: {
          position: offset,
        },
        position_ms: progress,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("access_token=")[1]}`,
      },
    }
  );
};

export const playbackService = {
  playbackState: { key: "playback-state", fn: getPlaybackState },
  play: {
    contextKey: "context-",
    contextFn: playContext,
    songKey: "context-",
    songFn: playSong,
  },
  devices: { key: "devices", fn: getDevices },
};
