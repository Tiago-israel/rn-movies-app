import { theme } from "@/theme";

export const movieDarkTheme = {
  ...theme,
  colors: {
    primary: "#000000",
    onPrimary: "#ffffff",
    secondary: "#272727",
    onSecondary: "#ffffff",
    surface: "#101218",
    surfaceVariant: "#272727",
    onSurface: "#ffffff",
    onSurfaceVariant: "#ffffff",
    "surface-overlay": "rgba(16, 18, 24, 0.9)",
    onSurfaceBorder: "#272727",
    onSurfaceVariantBorder: "#ffffff",
    alternates: {
      primary: "#ffffff",
    },
    components: {
      "icon-button": {
        primary: {
          container: {
            color: "#272727",
          },
          "on-container": {
            color: "#ffffff",
          },
        },
      },
      "nav-bar": {
        container: {
          color: "#272727",
        },
      },
      button: {
        primary: {
          color: "#ffffff",
          backgroundColor: "#000000",
        },
        secondary: {
          color: "#000000",
          backgroundColor: "#ffffff",
        },
        disabled: {
          color: "#7f8c8d",
          backgroundColor: "#bdc3c7",
        },
      },
    },
  },
};
