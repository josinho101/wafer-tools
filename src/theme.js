import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#e4ab00",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "0.5em",
          height: "0.5em",
          backgroundColor: "black",
        },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: 10,
          background: "white",
        },
        html: {
          backgroundColor: "black",
        },
      },
    },
  },
});
