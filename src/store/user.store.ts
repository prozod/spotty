import { create } from "zustand";
type State = {
    accessToken: string;
    loggedIn: boolean;
    currentUser: any;
    savedTracks: any;
};
type Action = {
    updateAccessToken: (accessToken: State["accessToken"]) => void;
    updateLoginState: (loggedIn: State["loggedIn"]) => void;
    updateCurrentUser: (currentUser: State["currentUser"]) => void;
    updateSavedTracks: (savedTracks: State["savedTracks"]) => void;
};

const useUserStore = create<Action & State>()((set) => ({
    accessToken: "",
    loggedIn: false,
    currentUser: null,
    savedTracks: null,
    updateAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
    updateLoginState: (loggedIn: boolean) => set(() => ({ loggedIn: loggedIn })),
    updateCurrentUser: (currentUser) => set(() => ({ currentUser: currentUser })),
    updateSavedTracks: (savedTracks) => set(() => ({ savedTracks: savedTracks })),
}));

export default useUserStore;
