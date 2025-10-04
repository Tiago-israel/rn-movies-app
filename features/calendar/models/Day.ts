export class Day {
  date: Date;
  active: boolean = false;
  isInRange: boolean = false;
  isFirstActive: boolean = false;
  isLastActive: boolean = false;
  disabled: boolean = false;

  constructor(date: Date, readonly isCurrent = false) {
    this.date = new Date(date);
  }

  get day() {
    return this.date.getDate();
  }

  get dayStr() {
    const day = this.date.getDate();
    return day < 10 ? `0${day}` : `${day}`;
  }

  get year() {
    return this.date.getFullYear();
  }

  get month() {
    return this.date.getMonth();
  }

  get dayCode() {
    return this.date.getDay();
  }

  getDate() {
    return this.date.getDate();
  }

  getTime() {
    return this.date.getTime();
  }
}
