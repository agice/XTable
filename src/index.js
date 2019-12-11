import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ComponentSheet from "./ComponentSheet"


const app = ReactDOM.render(<App ref={(x) => {window.ourComponent = x}} model = {{
    axes: [{id:11, name:'期数', labels:[{id:1, name:'3'}, {id:2, name:'6'}, {id:3, name:'9'}, {id:4, name:'12'} ]},
      {id:12, name:'测试组', labels:[{id:1, name:'A'}, {id:2, name:'B'} ]},
      {id:13, name:'风险等级', labels:[{id:1, name:'RG0'}, {id:2, name:'RG1'}, {id:3, name:'RG2'}, {id:4, name:'RG3'}, {id:5, name:'RG4'}, {id:6, name:'RG5'} ]},
      {id:14, name:'复贷', labels:[{id:1, name:'是'}, {id:2, name:'否'} ]}],
    rows: [{id:11},{id:12}],
    columns: [{id:13},{id:14}],
    keys: [{id:1, name:'3'}, {id:2, name:'6'}],
    cells: [{labels:[{axis:11, label:1}, {axis:12, label:1}, {axis:13, label:1}, {axis:14, label:1}], values: [{key:1, value:'hello'}, {key:2, value:123}]}, 
      {labels:[{axis:11, label:1}, {axis:12, label:2}, {axis:13, label:1}, {axis:14, label:1}], values: [{key:1, value:'world'}, {key:2, value:246}]}]
  }} />, document.getElementById('root'));

  window.ourComponent.someMethod();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

