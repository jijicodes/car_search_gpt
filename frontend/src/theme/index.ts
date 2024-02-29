import { grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";

export const customTheme = deepMerge(grommet, {
  button: {
    border: {
      radius: "11px",
    },
    hover: {
      color: "#7cbfb1",
    },
    default: {
      background: {
        color: "#a2f2e1",
      },
    },
  },
});
