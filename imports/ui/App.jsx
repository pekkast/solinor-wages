import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Wages from '../api/wages.js';
import Shifts from '../api/shifts.js';
import Employees from '../api/employees.js';

import FileSelect from './FileSelect.jsx';
import WageTable from './WageTable.jsx';

// App component - represents the whole app
class App extends Component {

  parseFile({name, contents}) {
    Meteor.call('shifts.fromFile', {name, contents});
  }

  renderRawWages() {
    const rows = this.props.wages.map(({_id, wagePeriod, employee, date, hours, regular, evening, overtime, shifts}) => (
      <tr key={_id}>
        <td>{employee.userName}</td>
        <td>{wagePeriod}</td>
        <td>{(new Date(date)).toLocaleDateString()}</td>
        <td>{hours}</td>
        <td>${regular.toFixed(2)}</td>
        <td>${evening.toFixed(2)}</td>
        <td>${overtime.toFixed(2)}</td>
        <td>${(regular + evening + overtime).toFixed(2)}</td>
      </tr>
    ));

    return (<table className="table table-striped">
      <thead><tr><th>Name</th><th>Source</th><th>Date</th><th>Hours</th><th>Reg.</th><th>Night</th><th>Overtime</th><th>Total</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>);
  }

  renderGroupedWages() {
    const people = new Map();
    // Map wages per employee & wage period
    this.props.wages.forEach(wage => {
      const key = wage.wagePeriod + '|' + wage.employee.userId;
      const value = people.has(key) ? people.get(key) : [];
      value.push(wage);
      people.set(key, value);
    });

    let result = [];

    for (let [key, value] of people) {
      const header = value[0].employee;
      header.wagePeriod = value[0].wagePeriod;
      result.push(
        <WageTable key={key} header={header} wages={value} />
      );
    }

    return result;
  }

  render() {
    return (
      <div className="container">
        <h1>Palkanlaskenta</h1>
        <FileSelect onSelect={this.parseFile} />
        <hr />
        <h2>Palkkarivit</h2>
        {this.renderGroupedWages()}
      </div>
    );
  }
}

App.propTypes = {
  wages: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    wages: Wages.find({}, {sort: {'employee.userId': 1, date: 1}}).fetch(),
  };
}, App);