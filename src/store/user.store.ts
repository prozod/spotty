import { create } from "zustand";

type State = {
  accessToken: string;
  loggedIn: boolean;
  currentUser: any;
  savedTracks: any;
  searchResults: any;
};

type Action = {
  updateAccessToken: (accessToken: State["accessToken"]) => void;
  updateLoginState: (loggedIn: State["loggedIn"]) => void;
  updateCurrentUser: (currentUser: State["currentUser"]) => void;
  updateSavedTracks: (savedTracks: State["savedTracks"]) => void;
  updateSearchResults: (searchResults: State["searchResults"]) => void;
};

const useUserStore = create<Action & State>()((set) => ({
  accessToken: "",
  loggedIn: false,
  currentUser: null,
  savedTracks: null,
  searchResults: null,
  updateAccessToken: (accessToken) => set(() => ({ accessToken: accessToken })),
  updateLoginState: (loggedIn: boolean) => set(() => ({ loggedIn: loggedIn })),
  updateCurrentUser: (currentUser) => set(() => ({ currentUser: currentUser })),
  updateSavedTracks: (savedTracks) => set(() => ({ savedTracks: savedTracks })),
  updateSearchResults: (searchResults) =>
    set(() => ({ searchResults: searchResults })),
}));

export default useUserStore;
