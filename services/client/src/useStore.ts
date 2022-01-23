import create from "zustand";

type Authorization = {
  accessToken: string;
  expiresIn: number;
};

type State = {
  authorization?: Authorization;
  isAuthorized: () => boolean;
  setAuthorization: (authorization: Authorization) => void;
};

export const useStore = create<State>((set, get) => ({
  authorization: undefined,
  isAuthorized: () => !!get().authorization,
  setAuthorization: (authorization) => set({ authorization }),
}));
