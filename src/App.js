import React from 'react';
import XTable from './XTable';

export default class App extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
    <div>
        <XTable model={this.props.model}></XTable>
    </div>
    );
  }
}

