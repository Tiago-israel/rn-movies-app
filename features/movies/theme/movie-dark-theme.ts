import { theme } from "./base-theme";

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
    alternatives: {
      turquoise: "#1abc9c",
      emerald: "#2ecc71",
      peterRiver: "#3498db",
      amethyst: "#9b59b6",
      wetAsphalt: "#34495e",
      greenSea: "#16a085",
      nephritis: "#27ae60",
      belizeHole: "#2980b9",
      wisteria: "#8e44ad",
      midnightBlue: "#2c3e50",
      sunflower: "#f1c40f",
      carrot: "#e67e22",
      alizarin: "#e74c3c",
      clouds: "#ecf0f1",
      concrete: "#95a5a6",
      orange: "#f39c12",
      pumpkin: "#d35400",
      silver: "#bdc3c7",
      asbestos: "#7f8c8d",
      pomegranate: "#c0392b",
    },
  },
};
