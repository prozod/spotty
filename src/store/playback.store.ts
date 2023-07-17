import { create } from "zustand";
import {
  CurrentlyPlaying,
  Devices,
  Episode,
  Track,
  WebPlaybackStateObject,
} from "../types/spotify";

type State = {
  playback: CurrentlyPlaying<Track | Episode> | undefined;
  webSDKplayback: WebPlaybackStateObject | undefined;
  player: any;
  isActive: boolean;
  devices: Devices | undefined;
  device_id: string | undefined;
  likes: Map<string, boolean>;
  likedTracks: Map<string, boolean>;
};

type Action = {
  updatePlaybackState: (accessToken: State["playback"]) => void;
  updatePlayerSDK: (accessToken: State["player"]) => void;
  updateWebSDKPlayback: (webSDKplayback: State["webSDKplayback"]) => void;
  updateIsActive: (isActive: State["isActive"]) => void;
  updateDevices: (devices: State["devices"]) => void;
  updateDeviceId: (device_id: State["device_id"]) => void;
  updateLikes: (likes: State["likes"]) => void;
  updateLikedTracks: (likedTracks: State["likedTracks"]) => void;
};

const usePlaybackStore = create<Action & State>()((set) => ({
  playback: undefined,
  webSDKplayback: undefined,
  player: null,
  isActive: false,
  devices: undefined,
  device_id: undefined,
  likes: new Map(),
  likedTracks: new Map(),
  updatePlaybackState: (playback) => set(() => ({ playback: playback })),
  updatePlayerSDK: (player) => set(() => ({ player: player })),
  updateWebSDKPlayback: (webSDKplayback) =>
    set(() => ({ webSDKplayback: webSDKplayback })),
  updateIsActive: (isActive) => set(() => ({ isActive: isActive })),
  updateDevices: (devices) => set(() => ({ devices: devices })),
  updateDeviceId: (device_id) => set(() => ({ device_id: device_id })),
  updateLikes: (likes) => set(() => ({ likes: likes })),
  updateLikedTracks: (likedTracks) => set(() => ({ likedTracks: likedTracks })),
}));

export default usePlaybackStore;
