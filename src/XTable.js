import React from 'react';
import _ from 'lodash';
import Datasheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import './XTable.css'

function buildViewModel(axes, rows, columns, keys, cells) {
  const evenClass = 'even';

  const checkParameters = () => {
    if (axes.length === 0) console.error('The dictionary is required.');
    if (rows.length === 0) console.error('The x-axis needs dictionary.');
    if (columns.length === 0) console.error('The y-axis needs dictionary.');
    if (keys.length !== 1) console.error('The z-axis has one and only one dictionary.')
    const xyzAxes = [...rows, ...columns, ...keys].map(x => x.id);
    if (!_.isEqual(xyzAxes.sort(), axes.map(x => x.id).sort())) console.error('All dictionaries need to be used.');
  }

  const prepareMeta = (arr) => {
    let [span, repeat] = [1, 1];

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

  const buildLeftHeader = (grid) => {
    for (let i = 0; i < columns.total; i++) {
      const row = [];
      columns.forEach(c => {
        let remainder = Math.floor(i / c.span) % c.labels.length;
        if (i % c.span === 0) { c.even = !c.even }
        row.push(c.even ? { t: c.labels[remainder].name, readOnly: true, className: evenClass } : { t: c.labels[remainder].name, readOnly: true });
      });
      for (let j = 0; j < rows.total; j++) {
        row.push({});
      }
      grid.push(row);
    }
  }

  const buildTopBar = (grid) => {
    const bar = [];
    columns.forEach(c => { bar.push({ t: c.name, readOnly: true }); });
    for (let i = 0; i < rows.total; i++) {
      bar.push({ readOnly: true });
    }
    grid.push(bar);
  }

  const buildTopHeader = (grid) => {
    rows.forEach(r => {
      const row = [];
      columns.forEach(() => { row.push({ readOnly: true }); });
      row[row.length - 1].t = r.name;
      let even = false;
      for (let i = 0; i < r.repeat; i++) {
        for (let j = 0; j < r.labels.length; j++) {
          even = !even;
          for (let k = 0; k < r.span; k++) {
            row.push(even ? { t: r.labels[j].name, readOnly: true, className: evenClass } : { t: r.labels[j].name, readOnly: true });
          }
        }
      }
      grid.push(row);
    });
  }

  const setValues = (grid) => {
    const findIndex = (cell, axes) => {
      let padding = 0;
      axes.forEach(axis => {
        const label = cell.labels.find(x => x[0] === axis.id)[1];
        const index = axis.labels.findIndex(x => x.id === label);
        padding += index * axis.span;
      })
      return padding;
    }
    cells.forEach(cell => {
      const x = findIndex(cell, rows);
      const y = findIndex(cell, columns);
      const z = findIndex(cell, keys);
      const node = grid[y + rows.length + 1][x + columns.length];
      if (node.v === undefined) { node.v = [] }
      node.v[z] = cell.value;
    })
  }

  checkParameters();
  prepareMeta(rows);
  prepareMeta(columns);
  prepareMeta(keys);
  const g = [];
  buildTopHeader(g);
  buildTopBar(g);
  buildLeftHeader(g);
  setValues(g);
  return g;
}

export default class XTable extends React.Component {
  constructor(props) {
    super(props)
    this.axes = props.axes;
    this.rows = props.rows.map(x => ({ id: x }));
    this.columns = props.columns.map(x => ({ id: x }));
    this.keys = props.keys.map(x => ({ id: x }));

    this.state = {
      grid: buildViewModel(this.axes, this.rows, this.columns, this.keys, props.cells),
      valueIndex: 0
    }

    this.handleValueKeyChange = this.handleValueKeyChange.bind(this);
  }

  getData() {
    const findLabels = (index, arr) => {
      const labels = [];
      arr.forEach(item => {
        const i = Math.floor(index / item.span) % item.labels.length;
        const label = item.labels[i].id;
        labels.push([item.id, label]);
      })
      return labels;
    }

    const findZLabels = (index, arr) => {
      return arr.map((item, i) => {
        return [item.id, item.labels[index].id];
      })
    }

    const getValue = (rows, columns, keys, grid) => {
      const data = [];
      for (let y = rows.length + 1; y < grid.length; y++) {
        for (let x = columns.length; x < grid[y].length; x++) {
          const node = grid[y][x];
          if (node.v === undefined) { continue }
          if (!node.v.some(e => e !== undefined && e !== '')) {
            delete node.v;
            continue;
          }
          node.v.forEach((v, i) => {
            if (v === undefined || v === '') { return }
            data.push({
              labels: [...findLabels(x - columns.length, rows), ...findLabels(y - rows.length - 1, columns), ...findZLabels(i, keys)],
              value: v
            });
          })
        }
      }
      return data;
    }
    return getValue(this.rows, this.columns, this.keys, this.state.grid);
  }

  changeAxes(rows, columns, keys) {
    const cells = this.getData();
    this.rows = rows.map(x => ({ id: x }));
    this.columns = columns.map(x => ({ id: x }));
    this.keys = keys.map(x => ({ id: x }));
    const grid = buildViewModel(this.axes, this.rows, this.columns, this.keys, cells);
    this.setState({ grid, valueIndex: 0 });
  }

  handleValueKeyChange(e) {
    const valueKey = parseInt(e.target.value);
    const valueIndex = this.axes.find(x => x.id === this.keys[0].id).labels.findIndex(x => x.id === valueKey)
    this.setState({ valueIndex: valueIndex })
  }

  render() {
    const valueAxis = this.axes.find(x => x.id === this.keys[0].id);
    const valueIndex = this.state.valueIndex;
    const valueKey = valueAxis.labels[valueIndex].id;
    return (
      <>
        <div>
          <label>{valueAxis.name}</label>
          {valueAxis.labels.map((n, i) =>
            <label key={n.id}><input type='radio' value={n.id} checked={n.id === valueKey} onChange={this.handleValueKeyChange} />{n.name}</label>
          )}
        </div>
        <Datasheet
          data={this.state.grid}
          valueRenderer={(cell) => {
            if (cell.t !== undefined) { return cell.t }
            if (cell.v !== undefined && cell.v[valueIndex] !== undefined) { return cell.v[valueIndex] }
            return ''
          }}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={changes => {
            const grid = this.state.grid;
            changes.forEach(({ cell, row, col, value }) => {
              const node = this.state.grid[row][col];
              if (node.v === undefined) { node.v = [] }
              node.v[valueIndex] = value;
            })
            this.setState({ grid })
          }}
        />
      </>
    )
  }
}

