import { Episode } from "./episode";
import { ErrorResponse, ExternalUrl, Paging, SpotifyType } from "./global";
import { SimplifiedTrack, Track } from "./track";

/**
 * The repeat state of the context.
 */
export type RepeatState = "track" | "off" | "context";

/**
 * Player error reason types.
 */
export type PlayerErrorReason =
  | "NO_PREV_TRACK"
  | "NO_NEXT_TRACK"
  | "NO_SPECIFIC_TRACK"
  | "ALREADY_PAUSED"
  | "NOT_PAUSED"
  | "NOT_PLAYING_TRACK"
  | "NOT_PLAYING_LOCALLY"
  | "NOT_PLAYING_CONTEXT"
  | "ENDLESS_CONTEXT"
  | "CONTEXT_DISALLOW"
  | "ALREADY_PLAYING"
  | "RATE_LIMITED"
  | "REMOTE_CONTROL_DISALLOW"
  | "DEVICE_NOT_CONTROLLABLE"
  | "VOLUME_CONTROL_DISALLOW"
  | "NO_ACTIVE_DEVICE"
  | "PREMIUM_REQUIRED"
  | "UNKNOWN";

/**
 * An object containing the details of a device.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-deviceobject
 */
export interface Device {
  /** The device ID. */
  id: string | null;
  /** If this device is the currently active device. */
  is_active: boolean;
  /** If this device is currently in a private session. */
  is_private_session: boolean;
  /** Whether controlling this device is restricted. At present if this is “true” then no Web API commands will be accepted by this device. */
  is_restricted: boolean;
  /** The name of the device. */
  name: string;
  /** The device type. */
  type: "Computer" | "Smartphone" | "Speaker";
  /** The current volume in percent. */
  volume_percent?: number;
}

/**
 * The context object of the player.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-contextobject
 */
export interface PlayerContext {
  /** External URLs for this context. */
  external_urls: ExternalUrl;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /** The object type. */
  type: SpotifyType;
  /** The Spotify URI for the context. */
  uri: string;
}

/**
 * The disallows from the CurrentlyPlayingContext object.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-disallowsobject
 */
export interface ContextDisallows {
  /** Interrupting playback. Optional field. */
  interrupting_playback: boolean;
  /** Pausing. */
  pausing?: boolean;
  /** Resuming. */
  resuming?: boolean;
  /** Seeking playback location. */
  seeking?: boolean;
  /** Skipping to the next context. */
  skipping_next?: boolean;
  /** Skipping to the previous context. */
  skipping_prev?: boolean;
  /** Toggling repeat context flag. */
  toggling_repeat_context?: boolean;
  /** Toggling repeat track flag. */
  toggling_repeat_track?: boolean;
  /** Toggling shuffle flag. */
  toggling_shuffle?: boolean;
  /** Transfering playback between devices. */
  transferring_playback?: boolean;
}

/**
 * The currently playing context of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-currentlyplayingcontextobject
 */
export interface CurrentlyPlayingContext extends CurrentlyPlaying {
  /** Allows to update the user interface based on which playback actions are available within the current context. */
  actions: ContextDisallows;
  /** The device that is currently active. */
  device: Device;
  /** The repeat state. */
  repeat_state: RepeatState;
  /** The shuffle state. */
  shuffle: boolean;
}

interface UsersQueueResponse {
  currently_playing: Track | Episode;
  queue: Array<Track | Episode>;
}

/**
 * The currently playing object of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-currentlyplayingobject
 */
export interface CurrentlyPlaying<T> {
  /** The context. */
  context: PlayerContext | null;
  /** The object type of the currently playing item. */
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  /** If something is currently playing, return true. */
  is_playing: boolean;
  /** The device that is currently active. */
  device: Device;
  /** Progress into the currently playing track or episode. */
  progress_ms: number | null;
  /** The item of the context. */
  item: T /** Track | Episode | null */;
  /** Unix Millisecond Timestamp when data was fetched. */
  timestamp: number;
}

/**
 * The cursor object of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-cursorobject
 */
export interface Cursor {
  /** The cursor to use as key to find the next page of items. */
  after: string;
}

/**
 * The cursor paging object of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-cursorpagingobject
 */
export interface CursorPaging<T>
  extends Omit<Paging<T>, "offset" | "previous"> {
  /** The cursors used to find the next set of items. */
  cursors: Cursor;
}

/**
 * The devices object of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-devicesobject
 */
export interface Devices {
  /** A list of 0..n Device objects. */
  devices: Device[];
}

/**
 * The recently played object which is returned by the [Player.getRecentlyPlayed] function.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
 */
export interface RecentlyPlayed {
  /** The cursors to check other pages of recently played. */
  cursors: Cursor;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /** The maximum number of items in the response (as set in the query or by default). */
  limit: number;
  /** URL to the next page of items. ( null if none) */
  next?: string;
  /** The total number of items available to return. */
  total: number;
  /** The items which have been recently played. */
  items: {
    /** The track which has been played recently. */
    track: Track;
    /** The timestamp when it was played. */
    playedAt: string;
  }[];
}

/**
 * The play history object of the player api.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-playhistoryobject
 */
export interface PlayHistory {
  /** The context the track was played from. */
  context: PlayerContext;
  /** The date and time the track was played. */
  played_at: string;
  /** The track the user listened to. */
  track: SimplifiedTrack;
}

/**
 * The error response sent by the spotify player api during unusual status codes.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#object-playererrorobject
 */
export interface PlayerErrorResponse extends ErrorResponse {
  /** The reason for the error. */
  reason: PlayerErrorReason;
}

export interface WebPlaybackStateObject {
  context: {
    uri: string; // The URI of the context (can be null)
    metadata: object; // Additional metadata for the context (can be null)
  };
  disallows: {
    // A simplified set of restriction controls for
    pausing: boolean; // The current track. By default, these fields
    peeking_next: boolean; // will either be set to false or undefined, which
    peeking_prev: boolean; // indicates that the particular operation is
    resuming: boolean; // allowed. When the field is set to `true`, this
    seeking: boolean; // means that the operation is not permitted. For
    skipping_next: boolean; // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean; // `seeking` will be set to `true` when playing an
    // ad track.
  };
  paused: boolean; // Whether the current track is paused.
  position: number; // The position_ms of the current track.
  repeat_mode: number; // The repeat mode. No repeat mode is 0,
  // repeat context is 1 and repeat track is 2.
  shuffle: boolean; // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrackObject; // The track currently on local playback
    previous_tracks: WebPlaybackTrackObject[]; // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrackObject[]; // Tracks queued next. Number can vary.
  };
}

export interface WebPlaybackTrackObject {
  uri: string; // Spotify URI
  id: string; // Spotify ID from URI (can be null)
  type: string; // Content type: can be "track", "episode" or "ad"
  media_type: string; // Type of file: can be "audio" or "video"
  name: "Song Name"; // Name of content
  is_playable: boolean; // Flag indicating whether it can be played
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [{ url: string }];
  };
  artists: [{ uri: string; name: string }];
}
