import React from "react";
import { Box, Text, Paragraph, Image, Button } from "grommet";
import { useFetchCars } from "../hooks/useFetchCars";

export const LandingSearchBy = () => {
  const carmakes = useFetchCars();
  return (
    <Box fill gap="small" direction="column" align="center">
      <Box alignContent="center" gap="small">
        <Image
          alignSelf="center"
          width="50px"
          src={process.env.PUBLIC_URL + `/images/logo.png`}
          alt="logo"
        />
        <Text>How car I help you?</Text>
      </Box>

      <Box direction="row" gap="small">
        <Button label="search by makes" />
        <Button label="search by names" />
        <Button label="search by specs" />
      </Box>
    </Box>
  );
};
