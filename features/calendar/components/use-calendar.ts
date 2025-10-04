import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarProps } from "../CalendarProps";
import { DAYS, GRID_CELLS_SIZE } from "../consts";
import { DateRange, Day } from "../models";

function getMonthDays(month: number, year: number) {
  const days: Day[] = [];
  const currentDate = new Date(year, month, 1);

  while (currentDate.getMonth() === month) {
    const day = currentDate.getDate();
    days.push(new Day(currentDate, true));
    currentDate.setDate(day + 1);
  }

  // const firstDay = days[0];
  // if (firstDay.dayCode !== DAYS.SUN) {
  //   currentDate.setMonth(month, firstDay.getDate());
  //   for (let i = 1; i <= firstDay.dayCode; i++) {
  //     currentDate.setDate(currentDate.getDate() - 1);
  //     days.unshift(new Day(currentDate));
  //   }
  // }

  // const remainingCells = GRID_CELLS_SIZE - days.length;
  // currentDate.setMonth(month + 1);
  // for (let i = 1; i <= remainingCells; i++) {
  //   currentDate.setDate(i);
  //   days.push(new Day(currentDate));
  // }

  return days;
}

export function useCalendar({ locale = "pt-BR", ...props }: CalendarProps) {
  const yearRef = useRef<number>(0);
  const monthRef = useRef<number>(0);
  const rangeRef = useRef<DateRange>(new DateRange());

  const [monthLabel, setMonthLabel] = useState<string>("");
  const [monthDays, setMonthDays] = useState<Day[]>([]);
  const [currentMonth, setCurrentMonth] = useState(props.month || 0);

  function nexMonth() {
    monthRef.current = monthRef.current === 11 ? 0 : monthRef.current + 1;
    yearRef.current =
      monthRef.current === 0 ? yearRef.current + 1 : yearRef.current;
    setMonthDays(getMonthDays(monthRef.current, yearRef.current));
    setMonthLabel(
      new Date(yearRef.current, monthRef.current).toLocaleString(locale, {
        month: "long",
        year: "numeric",
      })
    );
  }

  function prevMonth() {
    monthRef.current = monthRef.current === 0 ? 11 : monthRef.current - 1;
    yearRef.current =
      monthRef.current === 11 ? yearRef.current - 1 : yearRef.current;
    setMonthDays(getMonthDays(monthRef.current, yearRef.current));
    setMonthLabel(
      new Date(yearRef.current, monthRef.current).toLocaleString(locale, {
        month: "long",
        year: "numeric",
      })
    );
  }

  function onDayPress(day: Day, index: number) {
    if (day.active) {
      rangeRef.current.remove(day);
    } else {
      rangeRef.current.add(day);
    }
    setMonthDays((data) => {
      return data.map((item, key) => {
        if (key === index) {
          item.active = !item.active;
          item.isFirstActive = rangeRef.current.start
            ? item.getTime() === rangeRef.current.start.getTime()
            : false;
          item.isLastActive = rangeRef.current.end
            ? item.getTime() === rangeRef.current.end.getTime()
            : false;
        }
        item.isInRange = rangeRef.current.isIncluded(item);
        console.log('---->',item.dayStr, item.isInRange, item.active, item.isFirstActive, item.isLastActive);
        return item;
      });
    });
  }

  function setup() {
    const date = new Date();
    if (props.month) {
      date.setMonth(props.month);
    }
    if (props.year) {
      date.setFullYear(props.year);
    }
    setCurrentMonth(date.getMonth());
    monthRef.current = date.getMonth();
    yearRef.current = date.getFullYear();
    setMonthDays(getMonthDays(date.getMonth(), date.getFullYear()));
    setMonthLabel(
      date.toLocaleString(locale, {
        month: "long",
        year: "numeric",
      })
    );
  }

  useEffect(() => {
    setup();
  }, []);

  return {
    monthDays,
    currentMonth,
    monthLabel,
    nexMonth,
    prevMonth,
    onDayPress,
  };
}
