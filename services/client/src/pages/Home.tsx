import * as React from "react";
import { Chrome } from "../components/Chrome";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import { useEffect } from "react";

export const Home: React.FC = () => {
  const playerPromise = useSpotifyPlayer();

  useEffect(() => {
    (async () => {
      const player = await playerPromise;
      console.debug("player", player);
    })();
  }, [playerPromise]);

  return (
    <Chrome>
      <h1>Home!</h1>
    </Chrome>
  );
};
