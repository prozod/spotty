import { create } from "zustand";
import { Devices, WebPlaybackStateObject } from "../types/spotify";
type State = {
  playback: WebPlaybackStateObject | undefined;
  player: any;
  isActive: boolean;
  devices: Devices | undefined;
  device_id: string | undefined;
};
type Action = {
  updatePlaybackState: (accessToken: State["playback"]) => void;
  updatePlayerSDK: (accessToken: State["player"]) => void;
  updateIsActive: (isActive: State["isActive"]) => void;
  updateDevices: (devices: State["devices"]) => void;
  updateDeviceId: (device_id: State["device_id"]) => void;
};

const usePlaybackStore = create<Action & State>()((set) => ({
  playback: undefined,
  player: null,
  isActive: false,
  devices: undefined,
  device_id: undefined,
  updatePlaybackState: (playback) => set(() => ({ playback: playback })),
  updatePlayerSDK: (player) => set(() => ({ player: player })),
  updateIsActive: (isActive) => set(() => ({ isActive: isActive })),
  updateDevices: (devices) => set(() => ({ devices: devices })),
  updateDeviceId: (device_id) => set(() => ({ device_id: device_id })),
}));

export default usePlaybackStore;
