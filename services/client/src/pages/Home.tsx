import * as React from "react";
import { useEffect } from "react";
import { Chrome } from "../components/Chrome";

export const Home: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(
            "BQD0MehMxxj8vdsFRpqMvNMWhjSAROus5Uv603mMBBLdJk9nAZMf0wtsMuRcBxczTwVYK6QNK6cO9Q-pii65kmDmn7DhBc0Ia6CFS18XhvgVFHedkZTpXDOm1WGzb2yiIIYksZSMdf1o-VcI2pkaRh13o2cZTwF6mdbI"
          );
        },
        volume: 0.5,
      });

      // @ts-ignore
      global.player = player;
      console.debug("player", player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);

        player.togglePlay();
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      player.connect();
    };
  });

  return (
    <Chrome>
      <h1>Home!</h1>
    </Chrome>
  );
};
