import React from 'react';
import XTable from './XTable';
import XTableConf from './XTableConf';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGetDataClick = this.handleGetDataClick.bind(this);
    this.handleValueKeyChange = this.handleValueKeyChange.bind(this);
    this.handleChangeAxesClick = this.handleChangeAxesClick.bind(this);
    this.state = { valueKey: props.model.valueKey };
  }

  handleGetDataClick() {
    console.log(this.xTable.getData());
    this.xTable.changeAxes([{ id: 6 }, { id: 11 }],[{ id: 13 }, { id: 14 }, { id: 12 }]);
  }

  handleValueKeyChange(valueKey) {
    this.setState({ valueKey });
  }

  handleChangeAxesClick(columns, rows) {
    this.xTable.changeAxes(rows, columns);
  }

  render() {
    return (
      <>
        <XTable
          ref={(x) => { this.xTable = x }}
          axes={this.props.model.axes}
          keys={this.props.model.keys}
          rows={this.props.model.rows}
          columns={this.props.model.columns}
          valueKey={this.state.valueKey}
          cells={this.props.model.cells} ></XTable>

        <XTableConf
          axes={this.props.model.axes}
          keys={this.props.model.keys}
          columns={this.props.model.columns}
          rows={this.props.model.rows}
          valueKey={this.state.valueKey}
          onChangeAxesClick={this.handleChangeAxesClick}
          onValueKeyChange={this.handleValueKeyChange}
          onGetDataClick={this.handleGetDataClick} ></XTableConf>
      </>
    );
  }
}

