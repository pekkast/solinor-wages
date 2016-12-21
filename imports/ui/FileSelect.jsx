import React, { Component, PropTypes } from 'react';

// File selection component
export default class FileSelect extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClick() {
    this.fileInput.click();
  }

  handleSelect() {
    const files = this.fileInput.files;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      this.fileName.value = file.name;

      // Only process csv files.
      // Uncomment after tested on windows
      //if (!file.type.match('text/csv'))
        //alert('csv file expected');

      // Pass result to caller as file is loaded
      reader.onload = (event) => {
        this.props.onSelect({name: file.name, contents: event.target.result});
      };
      // Read the data in.
      reader.readAsText(file);
    }
  }

  render() {
    return (
      <div className="file-select">
        <div className="input-group">
            <span className="input-group-addon">
                <i className="glyphicon glyphicon-file"></i>
            </span>
            <input readOnly ref={(input) => {this.fileName = input;}} className="form-control" type="text" />
            <span className="input-group-btn">
                <button className="btn btn-default" type="button" onClick={this.handleClick}>Select File</button>
            </span>
        </div>
        <div className="hidden">
            <input type="file" name="file" ref={(input) => {this.fileInput = input;}} onChange={this.handleSelect} />
        </div>
      </div>
    );
  }
}
