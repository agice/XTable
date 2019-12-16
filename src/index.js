import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const model = {
    axes: [
        { id: 11, name: 'Gender', labels: [{ id: 1, name: 'F' }, { id: 2, name: 'M' }] },
        { id: 12, name: 'Age', labels: [{ id: 1, name: '(0,18)' }, { id: 2, name: '[18,35)' }, { id: 2, name: '[35,60]' }, { id: 2, name: '(60,)' }] },
        { id: 13, name: 'City', labels: [{ id: 1, name: 'New York' }, { id: 2, name: 'Tokyo' }, { id: 3, name: 'Beijing' }] },
        { id: 14, name: 'Levels', labels: [{ id: 1, name: 'Junior' }, { id: 2, name: 'Senior' }] },
        { id: 6, name: 'Departments', labels: [{ id: 101, name: 'RD' }, { id: 102, name: 'PM' }, { id: 103, name: 'QA' }] },
        { id: 7, name: 'Parameters', labels: [{ id: 10, name: 'Number' }, { id: 20, name: 'Code' }] }],
    rows: [11, 12],
    columns: [13, 14, 6],
    keys: [7],
    cells: [
        { labels: [[11, 1], [12, 2], [13, 3], [14, 1], [6, 102], [7, 10]], value: '3' },
        { labels: [[11, 1], [12, 2], [13, 3], [14, 2], [6, 102], [7, 20]], value: 'XMan' },
        { labels: [[11, 1], [12, 2], [13, 3], [14, 1], [6, 101], [7, 10]], value: '10' },
        { labels: [[11, 1], [12, 2], [13, 3], [14, 2], [6, 101], [7, 20]], value: 'Ken' }]
};

ReactDOM.render(<App model={model} />, document.getElementById('root'));

serviceWorker.unregister();
