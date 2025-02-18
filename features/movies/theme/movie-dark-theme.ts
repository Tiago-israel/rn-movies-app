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
    },
  },
};
