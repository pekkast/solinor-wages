import { Meteor } from 'meteor/meteor';
import '../imports/api/employees.js';
import Shifts from '../imports/api/shifts.js';
import Wages from '../imports/api/wages.js';
import WorkShift from '../imports/objects/WorkShift.js';
import DailyWage from '../imports/objects/DailyWage.js';

Meteor.methods({
  'shifts.fromFile'({name, contents}) {

    // WorkShifts from rows
    const workShifts = [];
    const persons = new Map();
    const wagePeriod = name;

    // Using file name as wage period to reset rows
    Shifts.remove({wagePeriod});
    Wages.remove({wagePeriod});

    contents.split("\n").forEach((row) => {
      const [userName, userId, date, startTime, endTime] = row.split(',');
      // Do not process heading & eof
      const intId = parseInt(userId);
      if (isNaN(intId))
        return;

      if (!persons.has(userId)) {
        persons.set(userId, {userId, userName});
      }

      // Store
      const id = Shifts.insert({
        userName,
        userId,
        date,
        startTime,
        endTime,
        wagePeriod
      });

      workShifts.push(WorkShift.fromCsvRow(row).setIdRef(id));
    });

    // Calculate daily wages
    const dailyWages = new Map();

    workShifts.forEach(v => {
      if (!dailyWages.has(v.id)) {
        dailyWages.set(v.id, {
          name: v.name,
          dates: new Map(),
        });
      }

      const person = dailyWages.get(v.id);
      if (!person.dates.has(v.date.getTime())) {
        person.dates.set(v.date.getTime(), new DailyWage(v.date));
      }

      const dw = person.dates.get(v.date.getTime());
      dw.addShift(v);
      person.dates.set(v.date.getTime(), dw);
      dailyWages.set(v.id, person);
    });

    for (const [userId, data] of dailyWages) {
      const employee = persons.get(userId);

      data.dates.forEach((wage, date) => {
        const hours = wage.getTotalHours();
        const regular = +wage.getRegularSalary().toFixed(2);
        const evening = +wage.getEveningSalary().toFixed(2);
        const overtime = +wage.getOvertimeSalary().toFixed(2);
        const shifts = wage.shifts.map(shift => shift.idRef);
        Wages.insert({wagePeriod, employee, date, hours, regular, evening, overtime, shifts});
      });
    }
  }
});

Meteor.startup(() => {
  // code to run on server at startup
});
