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
    onSurfaceVariantBorder: "#95a5a6",
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

export type MovieTheme = typeof movieLightTheme;
