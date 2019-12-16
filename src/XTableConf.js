import React from 'react';
import _ from 'lodash';


export default class XTableConf extends React.Component {
    constructor(props) {
        super(props);

        this.handleGetDataClick = this.handleGetDataClick.bind(this);
        this.handleValueKeyChange = this.handleValueKeyChange.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleChangeAxesClick = this.handleChangeAxesClick.bind(this);

        this.handleAxesListChanage = this.handleAxesListChanage.bind(this);
        this.handleAddX = this.handleAddX.bind(this)
        this.handleRemoveX = this.handleRemoveX.bind(this)
        this.handleAddY = this.handleAddY.bind(this)
        this.handleRemoveY = this.handleRemoveY.bind(this)
        this.handleChangeZ = this.handleChangeZ.bind(this)

        this.axes = this.props.axes;
        this.xyz = {
            columns: this.props.columns,
            rows: this.props.rows,
            keys: this.props.keys,
            axes: _.without(this.axes.map(x => x.id), ...this.props.columns, ...this.props.rows, ...this.props.keys)
        };
        this.selected = {
            axis: this.xyz.axes.length > 0 ? this.xyz.axes[0] : null,
            row: this.xyz.rows[0],
            column: this.xyz.columns[0],
            key: this.xyz.keys[0],
            value: this.props.valueKey
        }
        this.state = { xyz: this.xyz, selected: this.selected }
        console.log(this.state)
    }

    handleGetDataClick(e) {
        this.props.onGetDataClick();
    }

    handleValueKeyChange(e) {
        this.selected.value = parseInt(e.target.value);
        this.setState({ selected: this.selected })
        this.props.onValueKeyChange(this.selected.value);
        console.log(this.state.selected)
    }

    handleRowsChange(e) {
        this.selected.row = parseInt(e.target.value);
        this.setState({ selected: this.selected })
        console.log(this.state.selected)
    }

    handleColumnsChange(e) {
        this.selected.column = parseInt(e.target.value);
        this.setState({ selected: this.selected })
        console.log(this.state.selected)
    }

    handleChangeAxesClick(e) {
        if (this.state.xyz.columns.length === 0 ||
            this.state.xyz.rows.length === 0 ||
            this.state.xyz.keys.length != 1 ||
            this.state.xyz.axes.length !== 0) {
            alert('Please assign all axes');
            return;
        }
        console.log(this.state)
        this.props.onChangeAxesClick(this.state.xyz);
    }

    handleAxesListChanage(e) {
        this.selected.axis = parseInt(e.target.value);
        this.setState({ selected: this.selected })
        console.log(this.state.selected)
    }

    handleAddX() {
        const selected = this.selected.axis;
        if (selected == null) { return }
        this.xyz.rows.push(selected);
        this.selected.row = selected;
        this.xyz.axes = this.xyz.axes.filter(x => x !== selected)
        this.selected.axis = this.xyz.axes.length > 0 ? this.xyz.axes[0] : null;
        this.setState({ xyz: this.xyz, selected: this.selected })
        console.log(this.state)
    }

    handleRemoveX() {
        const selected = this.selected.row;
        if (selected == null) { return }
        this.xyz.axes.push(selected);
        this.selected.axis = selected;
        this.xyz.rows = this.xyz.rows.filter(x => x !== selected)
        this.selected.row = this.xyz.rows.length > 0 ? this.xyz.rows[0] : null;
        this.setState({ xyz: this.xyz, selected: this.selected })
        console.log(this.state)
    }

    handleAddY() {
        const selected = this.selected.axis;
        if (selected == null) { return }
        this.xyz.columns.push(selected);
        this.selected.column = selected;
        this.xyz.axes = this.xyz.axes.filter(x => x !== selected)
        this.selected.axis = this.xyz.axes.length > 0 ? this.xyz.axes[0] : null;
        this.setState({ xyz: this.xyz, selected: this.selected })
        console.log(this.state)
    }

    handleRemoveY() {
        const selected = this.selected.column;
        if (selected == null) { return }
        this.xyz.axes.push(selected);
        this.selected.axis = selected;
        this.xyz.columns = this.xyz.columns.filter(x => x !== selected)
        this.selected.column = this.xyz.columns.length > 0 ? this.xyz.columns[0] : null;
        this.setState({ xyz: this.xyz, selected: this.selected })
        console.log(this.state)
    }

    handleChangeZ(e) {
        const selected = this.selected.axis;
        if (selected == null) { return }
        const currentKey = this.xyz.keys[0];
        this.xyz.keys = [selected];
        this.selected.key = selected;
        this.xyz.axes = this.xyz.axes.filter(x => x !== selected)
        this.xyz.axes.push(currentKey);
        this.selected.axis = currentKey;
        this.setState({ xyz: this.xyz, selected: this.selected })
        console.log(this.state)
    }

    render() {
        const findAxis = (id) => this.axes.find(x => x.id === id);
        const options = (arr) => {
            return arr.map(n => {
                const axis = findAxis(n);
                return <option key={axis.id} value={axis.id}>{axis.name}</option>
            })
        }

        return (
            <>
                <div><label>Value</label></div>
                <select size='5' value={this.state.selected.value} onChange={this.handleValueKeyChange}>
                    {findAxis(this.state.selected.key).labels.map((n) =>
                        <option key={n.id} value={n.id}>{n.name}</option>
                    )}
                </select>
                <p>
                    <input type="button" value="Get Data" onClick={this.handleGetDataClick} />
                </p>
                <table class='xtable-axes-table'>
                    <tbody>
                        <tr><td rowSpan='3'>
                            <div><label>Dictionary</label></div>
                            <select size='16' value={this.state.selected.axis !== null ? this.state.selected.axis : ''} onChange={this.handleAxesListChanage}>
                                {options(this.state.xyz.axes)}
                            </select>
                        </td>
                            <td> <div><input type='button' value='->' onClick={this.handleAddX}></input></div>
                                <div><input type='button' value='<-' onClick={this.handleRemoveX}></input></div> </td>
                            <td>
                                <div><label>X</label></div>
                                <select size='5' value={this.state.selected.row !== null ? this.state.selected.row : ''} onChange={this.handleRowsChange}>
                                    {options(this.state.xyz.rows)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td> <div><input type='button' value='->' onClick={this.handleAddY}></input></div>
                                <div><input type='button' value='<-' onClick={this.handleRemoveY}></input></div> </td>
                            <td>
                                <div><label>Y</label></div>
                                <select size='5' value={this.state.selected.column !== null ? this.state.selected.column : ''} onChange={this.handleColumnsChange}>
                                    {options(this.state.xyz.columns)}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td> <input type='button' value='<->' onClick={this.handleChangeZ}></input> </td>
                            <td>
                                <div><label>Z</label></div>
                                <input type='text' readOnly={true} value={findAxis(this.state.selected.key).name} />

                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    <input type="button" value="Change Axes" onClick={this.handleChangeAxesClick} />
                </p>
            </>
        );
    }
}

