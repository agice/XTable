import React from 'react';
import Datasheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

export default class XTable extends React.Component {
  constructor(props) {
    super(props)
    this.axes = props.axes;
    this.keys = props.keys;
    this.rows = props.rows;
    this.columns = props.columns;
    this.cells = props.cells;

    this.buildViewModel = function (axes, keys, rows, columns, cells) {
      const evenClass = 'even';

      const prepareMeta = (axes, arr) => {
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

      const buildLeftHeader = (columns, rows, grid) => {
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

      const buildBar = (columns, rows, grid) => {
        const bar = [];
        columns.forEach(c => { bar.push({ t: c.name, readOnly: true }); });
        for (let i = 0; i < rows.total; i++) {
          bar.push({ readOnly: true });
        }
        grid.push(bar);
      }

      const buildTopHeader = (columns, rows, grid) => {
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

      const findIndex = (cell, arr) => {
        let padding = 0;
        arr.forEach(item => {
          const label = cell.labels.find(x => x.axis === item.id).label;
          const index = item.labels.findIndex(x => x.id === label);
          padding += index * item.span;
        })
        return padding;
      }

      const setValue = (columns, rows, cells, grid) => {
        cells.forEach(cell => {
          const x = findIndex(cell, rows);
          const y = findIndex(cell, columns);
          const node = grid[y + rows.length + 1][x + columns.length];
          if (node.v === undefined) { node.v = [] }
          cell.values.forEach(x => node.v[keys.findIndex(n => n.id === x.key)] = x.value)
        })
      }

      prepareMeta(axes, columns);
      prepareMeta(axes, rows);

      const grid = [];
      buildTopHeader(columns, rows, grid);
      buildBar(columns, rows, grid);
      buildLeftHeader(columns, rows, grid);
      setValue(columns, rows, cells, grid);

      console.log(grid)
      return grid;
    }
    this.state = {
      grid: this.buildViewModel(this.axes, this.keys, this.rows, this.columns, this.cells),
      valueIndex: this.keys.findIndex(x => x.id === this.props.valueKey)
    }
  }

  getData() {
    const findLabels = (index, arr) => {
      const labels = [];
      arr.forEach(item => {
        const i = Math.floor(index / item.span) % item.labels.length;
        const label = item.labels[i].id;
        labels.push({ axis: item.id, label: label });
      })
      return labels;
    }

    const getValue = (columns, rows, keys, grid) => {
      const data = [];
      for (let y = rows.length + 1; y < grid.length; y++) {
        for (let x = columns.length; x < grid[y].length; x++) {
          const node = grid[y][x];
          if (node.v !== undefined) {
            if (!node.v.some(e => e !== undefined && e !== '')) {
              delete node.v;
              continue;
            }
            data.push({
              labels: findLabels(x - columns.length, rows).concat(findLabels(y - rows.length - 1, columns)),
              values: node.v.map((x, i) => { return { key: keys[i].id, value: x } })
            });
          }
        }
      }
      return data;
    }
    return getValue(this.columns, this.rows, this.keys, this.state.grid);
  }

  changeAxes(rows, columns) {
    this.cells = this.getData();
    this.rows = rows;
    this.columns = columns;
    const grid = this.buildViewModel(this.axes, this.keys, this.rows, this.columns, this.cells);
    this.setState({ grid });
  }

  render() {
    const valueIndex = this.keys.findIndex(x => x.id === this.props.valueKey);
    return (
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
    )
  }
}

