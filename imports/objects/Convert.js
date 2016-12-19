export default class Convert
{
  static toDecimalHours(time, dec)
  {
    time = time.split(':');
    return +time[0] + +(time[1] / 60).toFixed(dec);
  }
}
