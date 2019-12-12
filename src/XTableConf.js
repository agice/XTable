import React from 'react';

export default class XTableConf extends React.Component {
    constructor(props) {
        super(props);
        this.handleGetDataClick = this.handleGetDataClick.bind(this);
        this.handleValueKeyChange = this.handleValueKeyChange.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleChangeAxesClick = this.handleChangeAxesClick.bind(this);

        this.state = {
            columns: this.props.columns,
            rows: this.props.rows,
            valueKey: this.props.valueKey
        };
    }

    handleGetDataClick(e) {
        this.props.onGetDataClick();
    }

    handleValueKeyChange(e) {
        const valueKey = parseInt(e.target.value);
        this.setState({ valueKey: valueKey })
        this.props.onValueKeyChange(valueKey);
    }

    handleRowsChange(e) {
        const rows = e.target.value.split(',').map(x => parseInt(x));
        this.setState({ rows: rows })
    }

    handleColumnsChange(e) {
        const columns = e.target.value.split(',').map(x => parseInt(x));
        this.setState({ columns: columns })
    }

    handleChangeAxesClick(e) {
        this.props.onChangeAxesClick(this.state.columns, this.state.rows);
    }

    render() {
        const options = this.props.keys.map((key) =>
            <option key={key.id} value={key.id}>{key.name}</option>
        );
        const columns = this.state.columns.map(x => x.id).join();
        const rows = this.state.rows.map(x => x.id).join();
        const valueKey = this.state.valueKey;
        return (
            <>
                <p>
                    <input type="button" value="Get Data" onClick={this.handleGetDataClick} />
                </p>
                <p>
                    <label>value key</label>
                    <select defaultValue={valueKey} onChange={this.handleValueKeyChange}>
                        {options}
                    </select>
                </p>
                <p>
                    <label>Row</label>
                    <input type="text" defaultValue={rows} onChange={this.handleRowsChange} />
                    <label>Column</label>
                    <input type="text" defaultValue={columns} onChange={this.handleColumnsChange} />
                    <input type="button" value="Change Axes" onClick={this.handleChangeAxesClick} />
                </p>
            </>
        );
    }
}

