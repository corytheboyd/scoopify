import * as React from "react";
import { Helmet } from "react-helmet";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
