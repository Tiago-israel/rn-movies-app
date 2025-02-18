import { theme } from "@/theme";

export const movieLightTheme = {
  ...theme,
  colors: {
    primary: "#000000",
    onPrimary: "#ffffff",
    secondary: "#dfe6e9",
    onSecondary: "#2c3e50",
    surface: "#ecf0f1",
    surfaceVariant: "#ffffff",
    onSurface: "#141414",
    onSurfaceVariant: "#95a5a6",
    "surface-overlay": "rgba(236, 240, 241, 0.9)",
    onSurfaceBorder: "#ccc",
    alternates: {
      primary: "#061C2F",
    },
    components: {
      "icon-button": {
        primary: {
          container: {
            color: "#ffffff",
          },
          "on-container": {
            color: "#000000",
          },
        },
      },
      "nav-bar": {
        container: {
          color: "#ffffff",
        },
      },
    },
  },
};

export type MovieTheme = typeof movieLightTheme;
