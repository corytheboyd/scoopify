import create from "zustand";

type Authorization = {
  accessToken: string;
  expiresIn: number;
};

type State = {
  authorization?: Authorization;
  setAuthorization: (authorization: Authorization) => void;
};

export const useStore = create<State>((set) => ({
  authorization: undefined,
  setAuthorization: (authorization) => set({ authorization }),
}));
