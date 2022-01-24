import create from "zustand";
import { persist } from "zustand/middleware";
import WebPlaybackState = SpotifyWebPlayback.WebPlaybackState;

type Authorization = {
  accessToken: string;
  expiresIn: number;
};

type State = {
  authorization?: Authorization;
  isAuthorized: () => boolean;
  setAuthorization: (authorization: Authorization) => void;
  spotifyState?: WebPlaybackState;
  setSpotifyState: (state: WebPlaybackState) => void;
};

export const useStore = create<State>(
  persist(
    (set, get) => ({
      authorization: undefined,
      isAuthorized: () => !!get().authorization,
      setAuthorization: (authorization) => set({ authorization }),
      spotifyState: undefined,
      setSpotifyState: (state) => set({ spotifyState: state }),
    }),
    { name: "scoopify" }
  )
);
