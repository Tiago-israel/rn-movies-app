import { ReactNode, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { ThemeProvider } from "@/lib";
import { Box } from "./box";
import { movieDarkTheme, movieLightTheme } from "../theme";
import { useUserStore } from "../store";
import { initializeLanguage } from "../localization";

export type LayoutProps = {
  children: ReactNode;
};

export function Layout(props: LayoutProps) {
  const userTheme = useUserStore((state) => state.theme);
  const language = useUserStore((state) => state.language);

  useEffect(() => {
    initializeLanguage(language);
  }, [language]);

  return (
    <ThemeProvider
      theme={userTheme === "dark" ? movieDarkTheme : movieLightTheme}
    >
      <StatusBar style={userTheme === "dark" ? "light" : "dark"} />
      <Box
        width={"100%"}
        height="100%"
        pt={Constants.statusBarHeight}
        backgroundColor="surface"
      >
        {props.children}
      </Box>
    </ThemeProvider>
  );
}
