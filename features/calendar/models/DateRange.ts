import { Day } from "./Day";

export class DateRange {
  start?: Day;
  end?: Day;

  add(day: Day) {
    if (!this.start && !this.end) {
      this.start = day;
      return;
    }
    if (this.start && !this.end) {
      if (day.getTime() < this.start.getTime()) {
        this.end = this.start;
        this.start = day;
      } else {
        this.end = day;
      }
    } else {
      if (day.date.getTime() < this.end?.getTime()) {
        this.start = day;
      } else {
        this.start = this.end;
        this.end = day;
      }
    }
  }

  remove(day: Day) {
    if (this.start && this.start.date.getTime() === day.date.getTime()) {
      this.start = undefined;
      return;
    }
    if (this.end && this.end.date.getTime() === day.date.getTime()) {
      this.end = undefined;
      return;
    }
  }

  isIncluded(day: Day): boolean {
    if (!this.start || !this.end) {
      return false;
    }
    if (day.getTime() === this.start?.getTime()) return true;
    if (day.getTime() === this.end?.getTime()) return true;
    if (
      day.getTime() > this.start?.getTime() &&
      day.getTime() < this.end?.getTime()
    )
      return true;
    return false;
  }

  get rangeFilled(): boolean {
    return !!(this.start && this.end);
  }
}
