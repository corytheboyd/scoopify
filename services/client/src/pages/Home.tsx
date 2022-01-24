import * as React from "react";
import { Chrome } from "../components/Chrome";
import { useCallback, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useHashParameters } from "../hooks/useHashParameters";
import { useStore } from "../useStore";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "43ca9797a34e4774b41ce0f9737691c9";
const REDIRECT_URI = "http://localhost:3000/";

// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const setAuthorization = useStore((state) => state.setAuthorization);
  const isAuthorized = useStore((state) => state.isAuthorized);

  // if (isAuthorized()) {
  //   navigate("player");
  // }

  // Set authorization in state from URL hash
  const params = useHashParameters();
  useEffect(() => {
    const accessToken = params.get("access_token");

    if (accessToken) {
      const expiresIn = parseInt(params.get("expires_in") || "", 10);
      setAuthorization({
        accessToken,
        expiresIn,
      });

      navigate("player");
    }
  }, [params, navigate]);

  const handleLogin = useCallback(() => {
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.set("response_type", "token");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("scope", SCOPES.join(" "));
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    window.location.href = url.toString();
  }, []);

  const handleResetStorage = useCallback(() => {
    localStorage.clear();
  }, []);

  return (
    <Chrome>
      <Box>
        {!isAuthorized() && (
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login with Spotify
          </Button>
        )}
        {isAuthorized() && (
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login with Spotify
          </Button>
        )}
      </Box>

      <Box>
        <Button variant="outlined" color="error" onClick={handleResetStorage}>
          Clear Local State
        </Button>
      </Box>
    </Chrome>
  );
};
