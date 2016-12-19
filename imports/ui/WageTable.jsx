import React, { Component, PropTypes } from 'react';

function WageRow(props) {
    const {date, hours, regular, evening, overtime} = props.wage;

    return (
      <tr>
        <td>{(new Date(date)).toLocaleDateString()}</td>
        <td>{hours}</td>
        <td>${regular.toFixed(2)}</td>
        <td>${evening.toFixed(2)}</td>
        <td>${overtime.toFixed(2)}</td>
        <td>${(regular + evening + overtime).toFixed(2)}</td>
      </tr>
    );
}

function WageTableFooter(props) {
    const {summaryText, hours, regular, evening, overtime} = props.data;

    return (
      <tfoot>
        <tr>
          <th>{summaryText}</th>
          <th>{hours}</th>
          <th>${regular.toFixed(2)}</th>
          <th>${evening.toFixed(2)}</th>
          <th>${overtime.toFixed(2)}</th>
          <th>${(regular + evening + overtime).toFixed(2)}</th>
        </tr>
      </tfoot>
    );
}

export default class WageTable extends Component {
  render() {
    let total  = {},
        hours = 0,
        regular = 0,
        evening = 0,
        overtime = 0;

    const rows = this.props.wages.map((wage) => {
      hours += wage.hours;
      regular += wage.regular;
      evening += wage.evening;
      overtime += wage.overtime;
      return <WageRow key={wage._id} wage={wage} />;
    });

    total = {summaryText: 'Total', hours, regular, evening, overtime};

    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.header.userName} - {this.props.header.wagePeriod}</div>
        <table className="table table-striped">
            <thead><tr><th>Date</th><th>Hours</th><th>Reg.</th><th>Night</th><th>Overtime</th><th>Total</th></tr></thead>
            <tbody>{rows}</tbody>
            <WageTableFooter data={total} />
        </table>
      </div>);
  }
}