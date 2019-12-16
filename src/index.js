import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const model = {
    axes: [
        { id: 11, name: '期数', labels: [{ id: 1, name: '3' }, { id: 2, name: '6' }, { id: 3, name: '9' }, { id: 4, name: '12' }] },
        { id: 12, name: '测试组', labels: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] },
        { id: 13, name: '风险等级', labels: [{ id: 1, name: 'RG0' }, { id: 2, name: 'RG1' }, { id: 3, name: 'RG2' }, { id: 4, name: 'RG3' }, { id: 5, name: 'RG4' }, { id: 6, name: 'RG5' }] },
        { id: 14, name: '复贷', labels: [{ id: 1, name: '是' }, { id: 2, name: '否' }] },
        { id: 6, name: '资方', labels: [{ id: 101, name: '兴业' }, { id: 102, name: '云信' }, { id: 103, name: '富登' }] },
        { id: 7, name: '费率', labels: [{ id: 10, name: 'fee' }, { id: 20, name: 'money' }] }],
    rows: [{ id: 6 }, { id: 11 }, { id: 12 }],
    columns: [{ id: 13 }, { id: 14 }],
    keys: [{ id: 7 }],
    valueKey: 10,
    cells: [
        { labels: [{ axis: 11, label: 4 }, { axis: 12, label: 2 }, { axis: 13, label: 3 }, { axis: 14, label: 1 }, { axis: 6, label: 102 }, {axis: 7, label: 10}], value: 'hello' },
        { labels: [{ axis: 11, label: 4 }, { axis: 12, label: 2 }, { axis: 13, label: 3 }, { axis: 14, label: 1 }, { axis: 6, label: 102 }, {axis: 7, label: 20}], value: 'world' }]
};

ReactDOM.render(<App model={model} />, document.getElementById('root'));

serviceWorker.unregister();

