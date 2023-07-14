import { CurrentlyPlaying, Episode, Track } from "../types/spotify";

export function determineImgSourcePath(
  playback: CurrentlyPlaying<Track | Episode>
) {
  if (playback !== undefined) {
    if ("artists" in playback.item) {
      return playback?.item?.album?.images[1].url;
    }
    if ("show" in playback.item) {
      return playback?.item?.images[1].url;
    }
  }
  return "";
}
