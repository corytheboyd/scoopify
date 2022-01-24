import create from "zustand";
import { persist } from "zustand/middleware";

type Authorization = {
  accessToken: string;
  expiresIn: number;
};

type State = {
  authorization?: Authorization;
  isAuthorized: () => boolean;
  setAuthorization: (authorization: Authorization) => void;
};

export const useStore = create<State>(
  persist(
    (set, get) => ({
      authorization: undefined,
      isAuthorized: () => !!get().authorization,
      setAuthorization: (authorization) => set({ authorization }),
    }),
    { name: "scoopify" }
  )
);
