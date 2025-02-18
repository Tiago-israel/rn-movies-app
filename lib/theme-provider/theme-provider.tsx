import { createContext, useContext } from "react";

export type ThemeProviderProps = {
  theme: Record<string, any>;
  children: React.ReactNode;
};

export const ThemeContext = createContext({});

export function useTheme<T>(): T {
  const theme = useContext(ThemeContext);
  return theme as T;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
