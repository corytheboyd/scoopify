import * as React from "react";
import { Chrome } from "../components/Chrome";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer";
import { useStore } from "../useStore";
import { useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayCircle, PauseCircle } from "@mui/icons-material";

export const Player: React.FC = () => {
  const spotifyState = useStore((state) => state.spotifyState);
  const accessToken = useStore((state) => state.authorization?.accessToken);
  const playerPromise = useSpotifyPlayer(accessToken as string);

  const handlePlayPause = useCallback(async () => {
    const player = await playerPromise;
    await player.togglePlay();
  }, [playerPromise]);

  return (
    <Chrome>
      <h1>Player</h1>
      <Box>
        {!spotifyState?.paused && (
          <IconButton aria-label="play" onClick={handlePlayPause}>
            <PauseCircle />
          </IconButton>
        )}
        {spotifyState?.paused && (
          <IconButton aria-label="play" onClick={handlePlayPause}>
            <PlayCircle />
          </IconButton>
        )}
      </Box>
    </Chrome>
  );
};
