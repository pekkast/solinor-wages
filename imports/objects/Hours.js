export default class Hours
{
  static isInPeriod(time, period)
  {
    if (period.start > period.end) {
      if (time >= period.start)
        return true;

      if (time <= period.end)
        return true;
    }
    else if (time >= period.start && time <= period.end) {
      return true;
    }

    return false;
  }
}
