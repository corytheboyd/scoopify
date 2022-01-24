import * as React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Chrome: React.FC = (props) => {
  return (
    <Box sx={{ flexDirection: "column" }}>
      <Box component="header" sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar>
            <Link to="/">
              <Typography>Scoopify</Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component="main">{props.children}</Box>
    </Box>
  );
};
