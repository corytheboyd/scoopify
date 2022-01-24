import * as React from "react";
import { Helmet } from "react-helmet";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Player } from "./pages/Player";

const theme = createTheme();

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flex: 1 }}>
        <CssBaseline />

        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Helmet>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="player" element={<Player />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};
