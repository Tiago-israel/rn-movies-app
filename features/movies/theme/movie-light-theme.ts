import { theme } from "./base-theme";

/**
 * Light theme - Semantic color palette following Tailwind/shadcn conventions.
 * @see https://ui.shadcn.com/docs/theming
 */
export const movieLightTheme = {
  ...theme,
  colors: {
    // Surface & typography
    background: "#ecf0f1",
    foreground: "#141414",
    card: "#ffffff",
    "card-foreground": "#95a5a6",

    // Primary actions (buttons, CTAs)
    primary: "#000000",
    "primary-foreground": "#ffffff",

    // Secondary elements (chips, badges, icon buttons)
    secondary: "#dfe6e9",
    "secondary-foreground": "#2c3e50",

    // Muted/low-emphasis (inputs, cards variant)
    muted: "#ffffff",
    "muted-foreground": "#95a5a6",

    // Accent (links, highlights, alternates)
    accent: "#061C2F",
    "accent-foreground": "#ffffff",

    // Borders & input
    border: "#ccc",
    input: "#95a5a6",
    overlay: "rgba(236, 240, 241, 0.9)",

    // Component aliases (derived from semantic tokens)
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
    "icon-button": {
      container: "#ffffff",
      "on-container": "#000000",
    },

    // Palette - decorative colors (avatars, badges, charts)
    palette: {
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
