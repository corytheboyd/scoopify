import Player = SpotifyWebPlayback.Player;
import { useStore } from "../useStore";

let requestedScriptLoad = false;

let _playerResolve: (player: Player) => void;
let _playerReject: (errorMessage: string) => void;
const _playerPromise = new Promise<Player>((resolve, reject) => {
  _playerResolve = resolve;
  _playerReject = reject;
});

export const useSpotifyPlayer = (token: string): Promise<Player> => {
  if (!requestedScriptLoad) {
    requestedScriptLoad = true;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      global.player = player;
      console.debug("player", player);

      player.addListener("ready", ({ device_id }) => {
        console.debug("Device ID has come online", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.debug("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("initialization_error", message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("authentication_error", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("account_error", message);
      });

      player.addListener("player_state_changed", (state) => {
        console.debug("Player state changed", state);
        useStore.getState().setSpotifyState(state);
      });

      const isConnected = await player.connect();
      if (isConnected) {
        _playerResolve(player);
      } else {
        _playerReject("Failed to load Spotify Player");
      }
    };
  }

  return _playerPromise;
};
