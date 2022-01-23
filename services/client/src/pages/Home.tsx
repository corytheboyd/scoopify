import * as React from "react";
import { Chrome } from "../components/Chrome";
import { useCallback } from "react";
import { Button } from "@mui/material";
import { useHashParameters } from "../hooks/useHashParameters";
import { useStore } from "../useStore";

const CLIENT_ID = "43ca9797a34e4774b41ce0f9737691c9";
const REDIRECT_URI = "http://localhost:3000/";

// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const SCOPES = ["streaming", "playlist-read-private"];

export const Home: React.FC = () => {
  const { setAuthorization } = useStore();

  // access_token, token_type, expires_in
  const params = useHashParameters();

  const accessToken = params.get("access_token");
  if (accessToken) {
    const expiresIn = parseInt(params.get("expires_in") || "", 10);
    setAuthorization({
      accessToken,
      expiresIn,
    });
    window.location.hash = "";
  }

  const handleLogin = useCallback(() => {
    const url = new URL("https://accounts.spotify.com/authorize");
    url.searchParams.set("response_type", "token");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("scope", SCOPES.join(" "));
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    window.location.href = url.toString();
  }, []);

  return (
    <Chrome>
      <Button onClick={handleLogin}>Login with Spotify</Button>
    </Chrome>
  );
};
