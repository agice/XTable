import React from 'react';
import logo from './logo.svg';
import Datasheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import './App.css';
import { AssertionError } from 'assert';

export default class App extends React.Component {
  constructor (props) {
    const model = props.model;

    const buildViewModel = function(m)
    {
      const prepareHeader = (axes, arr) => {
        let [span,repeat] = [1,1];
        
        arr.forEach(item => {
          Object.assign(item, axes.find(x => x.id === item.id));  
          item.repeat = repeat;
          repeat *= item.labels.length;
        });
        [...arr].reverse().forEach(item => {
          item.span = span;
          span *= item.labels.length;
        });

        arr.total = span;
      }

      prepareHeader(m.axes, m.columns);
      prepareHeader(m.axes, m.rows);
      console.log(m);

      const grid = [];
      m.rows.forEach(r => {
        const row = [];
        m.columns.forEach(()=>{row.push({value: ''})})
        row[row.length-1].value = r.name;
        for(let i=0; i<r.repeat; i++) {
          for(let j=0; j<r.labels.length; j++) {
            for(let k=0; k<r.span; k++) {
              row.push({value: r.labels[j].name});
            }
          }
        }
        grid.push(row);
      });


      for(let i=0;i<m.rows.length;i++) {
        const r = m.rows[i];
        const row = [];

        if(i===0) {
          row.push({value:'', colSpan:m.columns.length-1, rowSpan:m.rows.length});
        }
        row.push({value:r.name});
        for(let i=0;i<r.repeat;i++) {
          r.labels.forEach(label=>{row.push({value:label.name, colSpan:r.span})});
        }
        grid.push(row);
      }
      
      const bar = [];
      m.columns.forEach(c=>{
        bar.push({value:m.axes.find(x=>x.id===c.id).name});
      })
      bar.push({value:'', colSpan:m.rows.total});
      grid.push(bar);

      for(let i=0;i<m.columns.total;i++){
        const row = [];
        m.columns.forEach(c=>{
          let remainder = Math.floor(i/c.span)%c.labels.length
          if(i%c.span === 0) {
            row.push({value:c.labels[remainder].name, rowSpan:c.span});
          }
        }); 
        for(let j=0;j<m.rows.total;j++) {
          row.push({value:''});
        }
        grid.push(row);
      }
      
      return grid;
    }

    super(props)
    this.state = {
      grid:buildViewModel(model)
    }
  }

  someMethod() {
    console.log("hello");
  }

  render () {
    return (
      <Datasheet
        data={this.state.grid}
        valueRenderer={(cell) => cell.value}
        onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
        onCellsChanged={changes => {
          const grid = this.state.grid.map(row => [...row])
          changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
          })
          this.setState({grid})
        }}
      />
    )
  }
}

