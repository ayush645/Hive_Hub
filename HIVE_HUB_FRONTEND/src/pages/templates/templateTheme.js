import { alpha, createTheme } from "@mui/material";

const templateTheme = (theme = {}) => {
  const {
    primaryColor = "#801B7C",
    secondaryColor = "#ff4081",
    textColor = "#000000",
  } = theme;

  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        dark: alpha(primaryColor, 0.9),
        light: alpha(primaryColor, 0.8),
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: "#f4f6f8",
      },
      text: {
        primary: textColor,
      },
      grey: {
        50: "#f9f9f9",
        100: "#f4f4f4",
        200: "#e9e9e9",
        300: "#e0e0e0",
        400: "#c4c4c4",
        500: "#9e9e9e",
        600: "#757575",
        700: "#616161",
        800: "#424242",
        900: "#212121",
      },
    },
    typography: {
      fontFamily: '"Arial", "Helvetica", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: "1px",
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "15px",
            overflow: "visible",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fafafa",
              "&:hover": {
                backgroundColor: "#ffffff",
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
              },
            },
          },
        },
      },
    },
  });
};

export default templateTheme;
