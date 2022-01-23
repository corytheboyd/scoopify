import { useEffect } from "react";
import Player = SpotifyWebPlayback.Player;

let isInstantiating = false;

export const useSpotifyPlayer = (token: string) => {
  let resolve: (player: Player) => void;
  let reject: () => void;
  const deferred = new Promise<Player>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  useEffect(() => {
    if (!isInstantiating) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      isInstantiating = true;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

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

      const isConnected = await player.connect();
      if (isConnected) {
        resolve(player);
      } else {
        reject();
      }
    };
  }, []);

  return deferred;
};
