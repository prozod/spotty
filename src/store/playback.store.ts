import { create } from "zustand";
type State = {
    playback: string;
    player: any;
    isActive: boolean;
    devices: any;
};
type Action = {
    updatePlaybackState: (accessToken: State["playback"]) => void;
    updatePlayerSDK: (accessToken: State["player"]) => void;
    updateIsActive: (isActive: State["isActive"]) => void;
    updateDevices: (devices: State["devices"]) => void;
};

const usePlaybackStore = create<Action & State>()((set) => ({
    playback: "",
    player: null,
    isActive: false,
    devices: null,
    updatePlaybackState: (playback) => set(() => ({ playback: playback })),
    updatePlayerSDK: (player) => set(() => ({ player: player })),
    updateIsActive: (isActive) => set(() => ({ isActive: isActive })),
    updateDevices: (devices) => set(() => ({ devices: devices })),
}));

export default usePlaybackStore;
