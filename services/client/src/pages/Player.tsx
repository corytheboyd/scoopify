import * as React from "react";
import { Chrome } from "../components/Chrome";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import { useStore } from "../useStore";
import { useEffect } from "react";

export const Player: React.FC = () => {
  const accessToken = useStore((state) => state.authorization?.accessToken);
  const playerPromise = useSpotifyPlayer(accessToken as string);

  useEffect(() => {
    (async () => {
      const player = await playerPromise;
      console.debug("player", player);
    })();
  }, [playerPromise]);

  return (
    <Chrome>
      <h1>Player</h1>
    </Chrome>
  );
};
