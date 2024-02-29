import { Box } from "grommet";
import React from "react";
import { LandingSearchBy } from "../components/LandingSearchBy";
import { FooterTextInput } from "../components/FooterTextInput";

export const LandingPage = () => {
  return (
    <Box fill direction="column">
      <LandingSearchBy />
      <Box>
        <FooterTextInput />
      </Box>
    </Box>
  );
};
