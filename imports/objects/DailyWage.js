export default class DailyWage
{
  constructor(date)
  {
    this.date = date;
    this.shifts = [];
  }

  addShift(shift)
  {
    this.shifts.push(shift);
  }

  getTotalHours()
  {
    return this.shifts.reduce(function(result, item) {
      return result + item.getDuration();
    }, 0);
  }

  getRegularSalary()
  {
    return this.getTotalHours() * DailyWage.getHourlyWage();
  }

  getEveningSalary()
  {
    return this.shifts.reduce(function(result, item) {
      return result + item.getEveningWorkDuration() * DailyWage.getEveningWorkCompensation();
    }, 0);
  }

  getOvertimeSalary()
  {
    return DailyWage.getOvertimeCompensation(this.getTotalHours());
  }

  static getOvertimeCompensation(hours)
  {
    let overtime = hours - this.getRegularHoursLimit();
    let compensation = 0;

    const steps = this.getOvertimeSteps();

    let i = 0;
    while (overtime > 0) {
      let step = steps[i++];
      let hours = step.duration ? Math.min(overtime, step.duration) : overtime;
      overtime -= hours;
      compensation += hours * step.addition;
    }

    return compensation * DailyWage.getHourlyWage();
  }

  static getRegularHoursLimit()
  {
    return 8;
  }

  static getHourlyWage()
  {
    return 3.75;
  }

  static getEveningWorkCompensation()
  {
    return 1.15;
  }

  static getOvertimeSteps()
  {
    return [{
      duration: 2,
      addition: .25,
    }, {
      duration: 2,
      addition: .5,
    }, {
      duration: undefined,
      addition: 1,
    }];
  }
}
