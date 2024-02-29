import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Text, Footer } from "grommet";
import { LandingPage } from "./pages/LandingPage";
import { Code } from "grommet-icons";

function App() {
  return (
    <Box fill background={"#303236"}>
      <LandingPage />
      <Footer pad="small" gap="xsmall" justify="center">
        <Code />
        <Text>Coded by JiJiCodes</Text>
        <Code />
      </Footer>
    </Box>
  );
}

export default App;
