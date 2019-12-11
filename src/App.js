import React from 'react';
import logo from './logo.svg';
import Datasheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import './App.css';
import { AssertionError } from 'assert';

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.model = props.model;
    this.buildViewModel = function(m)
    {
      const prepareMeta = (axes, arr) => {
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

      const buildLeftHeader = (m, grid) => {
        for (let i = 0; i < m.columns.total; i++) {
          const row = [];
          m.columns.forEach(c => {
            let remainder = Math.floor(i / c.span) % c.labels.length;
            //if(i % c.span === 0) {
            row.push({ value: c.labels[remainder].name, readOnly:true });
            //}
          });
          for (let j = 0; j < m.rows.total; j++) {
            row.push({ value: '' });
          }
          grid.push(row);
        }
      }
    
      const buildBar = (m, grid) => {
        const bar = [];
        m.columns.forEach(c => { bar.push({ value: c.name, readOnly:true }); });
        for (let i = 0; i < m.rows.total; i++) {
          bar.push({ value: '', readOnly:true });
        }
        grid.push(bar);
      }
    
      const buildTopHeader = (m, grid) => {
        m.rows.forEach(r => {
          const row = [];
          m.columns.forEach(() => { row.push({ value: '', readOnly:true }); });
          row[row.length - 1].value = r.name;
          for (let i = 0; i < r.repeat; i++) {
            for (let j = 0; j < r.labels.length; j++) {
              for (let k = 0; k < r.span; k++) {
                row.push({ value: r.labels[j].name, readOnly:true });
              }
            }
          }
          grid.push(row);
        });
      }

      const findIndex = (cell, arr) => {
        let padding = 0;
          arr.forEach(item => {
            const label = cell.labels.find(x => x.axis === item.id).label;
            const index = item.labels.findIndex(x => x.id == label);
            padding += index * item.span;
          })
        return padding;
      }

      const setValue = (m, grid) => {
        m.cells.forEach(cell => {
          const x = findIndex(cell, m.rows);
          const y = findIndex(cell, m.columns);
          grid[y + m.rows.length + 1][x + m.columns.length].value = cell.values.find(c => c.key === 1).value;
        })
      }

      prepareMeta(m.axes, m.columns);
      prepareMeta(m.axes, m.rows);

      const grid = [];
      buildTopHeader(m, grid);
      buildBar(m, grid);
      buildLeftHeader(m, grid);
      setValue(m, grid);
      console.log(m)
      console.log(grid)
      return grid;
    }

    this.state = { grid:this.buildViewModel(this.model), valueIndex:this.model.keys.findIndex(x=>x.id === this.model.key) }
  }
  
  getData() {
    const findLabels = (index, arr) => {
      const labels = [];
      arr.forEach(item => {
        const i = Math.floor(index/item.span) % item.labels.length;
        const label = item.labels[i].id;
        labels.push({axis:item.id, label: label});
      })
      return labels;
    }

    const getValue = (m, grid) => {
      const data = [];
      for(let y=m.rows.length+1; y<grid.length; y++) {
        for(let x=m.columns.length; x<grid[y].length; x++) {
          if(grid[y][x].value !== '') {
            data.push({
            labels:findLabels(x-m.columns.length, m.rows).concat(findLabels(y-m.rows.length-1, m.columns)),
            values: [{key:1, value:grid[y][x].value}]
            });
          }
        }
      }
      return data;
    }
    return getValue(this.model, this.state.grid);
  }

  changeAxes(rows, columns) {
    this.model.cells = this.getData();
    this.model.rows = rows;
    this.model.columns = columns;
    const grid = this.buildViewModel(this.model);
    this.setState({grid});
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

