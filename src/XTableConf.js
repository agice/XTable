import React from 'react';

export default class XTableConf extends React.Component {
    constructor(props) {
        super(props);

        this.handleGetDataClick = this.handleGetDataClick.bind(this);
        this.handleValueKeyChange = this.handleValueKeyChange.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleChangeAxesClick = this.handleChangeAxesClick.bind(this);

        this.handleAxesListChanage = this.handleAxesListChanage.bind(this);

        this.axes = this.props.axes;
        this.xyz = {
            columns: this.props.columns.map(x => x.id),
            rows: this.props.rows.map(x => x.id),
            keys: this.props.keys.map(x => x.id),
        };
        this.selected = {
            axis: this.axes[0].id,
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
        this.props.onChangeAxesClick(this.state.columns, this.state.rows);
    }

    handleAxesListChanage(e) {
        this.selected.axis = parseInt(e.target.value);
        this.setState({ selected: this.selected })
        console.log(this.state.selected)
    }

    render() {
        const findAxis = (id) => this.axes.find(x=>x.id === id);
        const options = (arr) => {
            return arr.map(n => {
                const axis = findAxis(n);
                return <option key={axis.id} value={axis.id}>{axis.name}</option>
            })
        }

        const options2 = (arr, axis) => {
            return arr.map(n => {
                return <option key={axis.id} value={axis.id}>{axis.name}</option>
            })
        }
        return (
            <>
                <p>
                    <select size='10' defaultValue={this.state.selected.axis} onChange={this.handleAxesListChanage}>
                        {this.axes.map((n) =>
                            <option key={n.id} value={n.id}>{n.name}</option>
                        )}
                    </select>
                </p>
                <p>
                    <input type="button" value="Get Data" onClick={this.handleGetDataClick} />
                </p>
                <p>
                    <label>X</label>
                    
                    <select size='10' defaultValue={this.state.xyz.row} onChange={this.handleRowsChange}>
                        {options(this.state.xyz.rows)}
                    </select>
                    <label>Y</label>
                    <select size='10' defaultValue={this.state.xyz.column} onChange={this.handleColumnsChange}>
                        {options(this.state.xyz.columns)}
                    </select>
                    <label>Z</label>
                    <input type='text' readOnly={true} defaultValue={findAxis(this.state.selected.key).name} />
                    <label>Value</label>
                    <select size='10' defaultValue={this.state.selected.value} onChange={this.handleValueKeyChange}>
                        {findAxis(this.state.selected.key).labels.map((n) =>
                            <option key={n.id} value={n.id}>{n.name}</option>
                        )}
                    </select>
                    {/* <label>Column</label>
                    <input type="text" defaultValue={this.state.xyz.columns} onChange={this.handleColumnsChange} />
                    <input type="button" value="Change Axes" onClick={this.handleChangeAxesClick} /> */}
                </p>
            </>
        );
    }
}

