import Convert from './Convert.js';
import Hours from './Hours.js';

export default class WorkShift
{
  constructor(name, id, date, start, end)
  {
    this.end = Convert.toDecimalHours(end, 2);
    this.start = Convert.toDecimalHours(start, 2);
    this.name = name;
    this.id = id;
    this.date = new Date(date.split('.').reverse().join('-'));
  }

  getDuration()
  {
    let duration = this.end - this.start;

    // Ended the next day
    if (duration < 0)
      duration += 24;

    return duration;
  }

  getEveningWorkDuration()
  {
    let period = WorkShift.getEveningWorkPeriod();
    const isEveningStart = Hours.isInPeriod(this.start, period);
    const isEveningEnd = Hours.isInPeriod(this.end, period);

    // All evening work
    if (isEveningStart && isEveningEnd) {
      return this.getDuration();
    }

    // Starts as evening work
    if (isEveningStart && !isEveningEnd) {
      return WorkShift.prototype.getDuration.call({start: this.start, end: period.end});
    }

    // Ends as evening work
    if (!isEveningStart && isEveningEnd) {
      return WorkShift.prototype.getDuration.call({start: period.start, end: this.end});
    }

    // is longer than evening period
    if (this.start < period.start && this.end > period.end && (this.end < this.start || this.start < period.end)) {
      return WorkShift.prototype.getDuration.call(period);
    }

    return 0;
  }

  isCrossDate()
  {
    return this.end < this.start;
  }

  setIdRef(id)
  {
    this.idRef = id;
    return this;
  }

  static getEveningWorkStart()
  {
    return 18;
  }

  static getEveningWorkEnd()
  {
    return 6;
  }

  static getEveningWorkPeriod()
  {
    return {
      start: WorkShift.getEveningWorkStart(),
      end: WorkShift.getEveningWorkEnd(),
    };
  }

  static fromCsvRow(row)
  {
    return new WorkShift(...row.split(','));
  }
}
