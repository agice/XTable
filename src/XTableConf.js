import React from 'react';

export default class XTableConf extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log('handleClick');
  }

  render () {
    return (
    <div>
      <p>
        <input type="button" value="Get Data" onClick={handlerGetData} />
      </p>
    </div>
    );
  }
}

