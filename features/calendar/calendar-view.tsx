import { useMemo } from "react";
import { useCalendar } from "./components/use-calendar";
import { type CalendarProps } from "./CalendarProps";
import { ThemeProvider } from "@/lib";
import { theme } from "./theme";
import { useWindowDimensions } from "react-native";
import { Calendar } from "./components";

export const CalendarView = (props: CalendarProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Calendar/>
    </ThemeProvider>
  );
};
