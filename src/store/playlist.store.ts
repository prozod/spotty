import { create } from "zustand";
type State = {
    playlist: any;
};
type Action = {
    updatePlaylist: (playlist: State["playlist"]) => void;
};

const usePlaylistStore = create<Action & State>()((set) => ({
    playlist: "",
    updatePlaylist: (playlist) => set(() => ({ playlist: playlist })),
}));

export default usePlaylistStore;
