import React from 'react';
import XTable from './XTable';
import XTableAxesConf from './XTableAxesConf';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleGetDataClick = this.handleGetDataClick.bind(this);
    this.handleChangeAxesClick = this.handleChangeAxesClick.bind(this);
  }

  handleGetDataClick() {
    alert(JSON.stringify(this.xTable.getData()).split('},{').join('},\n{'));
  }

  handleChangeAxesClick(xyz) {
    this.xTable.changeAxes(xyz.rows, xyz.columns, xyz.keys);
  }

  render() {
    return (
      <>
        <XTable
          ref={(x) => { this.xTable = x }}
          axes={this.props.model.axes}
          rows={this.props.model.rows}
          columns={this.props.model.columns}
          keys={this.props.model.keys}
          cells={this.props.model.cells} ></XTable>
        <p>
            <input type="button" value="Get Data" onClick={this.handleGetDataClick} />
        </p>

        <XTableAxesConf
          axes={this.props.model.axes}
          rows={this.props.model.rows}
          columns={this.props.model.columns}
          keys={this.props.model.keys}
          onChangeAxesClick={this.handleChangeAxesClick}
          onGetDataClick={this.handleGetDataClick} ></XTableAxesConf>
      </>
    );
  }
}

