import { Box, TextInput } from "grommet";
import { Send } from "grommet-icons";
import React from "react";

export const FooterTextInput = () => {
  return (
    <Box alignSelf="center" width={"70%"} style={{ paddingBottom: "20px" }}>
      <TextInput reverse placeholder="Message Car GPT" icon={<Send />} />
    </Box>
  );
};
