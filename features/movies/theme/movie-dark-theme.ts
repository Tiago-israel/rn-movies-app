import { theme } from "./base-theme";

/**
 * Dark theme - Semantic color palette following Tailwind/shadcn conventions.
 * @see https://ui.shadcn.com/docs/theming
 */
export const movieDarkTheme = {
  ...theme,
  colors: {
    // Surface & typography
    background: "#101218",
    foreground: "#ffffff",
    card: "#272727",
    "card-foreground": "#ffffff",

    // Primary actions (buttons, CTAs)
    primary: "#000000",
    "primary-foreground": "#ffffff",

    // Secondary elements (chips, badges, icon buttons)
    secondary: "#272727",
    "secondary-foreground": "#ffffff",

    // Muted/low-emphasis (inputs, cards variant)
    muted: "#272727",
    "muted-foreground": "#ffffff",

    // Accent (links, highlights, alternates)
    accent: "#ffffff",
    "accent-foreground": "#000000",

    // Borders & input
    border: "#272727",
    input: "#ffffff",
    overlay: "rgba(16, 18, 24, 0.9)",

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
      container: "#272727",
      "on-container": "#ffffff",
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
