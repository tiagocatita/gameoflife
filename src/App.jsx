import React from 'react';
import { connect } from 'react-redux';
import './App.css';

const CELL_SIZE = 12;

class Cell extends React.Component {
  render() {
    return (
      <rect
        width={CELL_SIZE}
        height={CELL_SIZE}
        x={this.props.x * CELL_SIZE}
        y={this.props.y * CELL_SIZE}
        className="cell"
        style={{ 'fill': this.props.cell ? 'slategray' : 'white' }}
        onClick={() => this.props.click(this.props.coord)}>
      </rect>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.life = this.life.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  createGrid() {

    var svg = [];
    for (let x = 0; x < this.props.ROWS; x++) {
      for (let y = 0; y < this.props.COLS; y++) {
        const coord = x + "," + y;
        svg.push(<Cell cell={this.props.cells[coord]} x={x} y={y} click={this.toggle} coord={coord} key={coord} />);
      }
    }
    return svg;
  }

  toggle(coord) {
    var obj = Object.assign({}, this.props.cells);
    obj[coord] = !obj[coord];

    this.props.dispatch({
      type: 'UPDATE_CELLS',
      data: obj
    })
  }

  reset() {
    this.pause();

    this.props.dispatch({ type: 'RESET' });
  }

  start() {
    if (!this.timer) this.timer = setInterval(this.life, 10);
  }

  pause() {
    clearInterval(this.timer);
    this.timer = false;
  }

  life() {
    var obj = Object.assign({}, this.props.cells);
    Object.keys(obj).forEach((key) => {
      var coords = key.split(',');
      var x = parseInt(coords[0], 10);
      var y = parseInt(coords[1], 10);
      var alive = 0;

      if (this.props.cells[(x - 1) + ',' + (y - 1)]) alive += 1;
      if (this.props.cells[x + ',' + (y - 1)]) alive += 1;
      if (this.props.cells[(x + 1) + ',' + (y - 1)]) alive += 1;
      if (this.props.cells[(x - 1) + ',' + y]) alive += 1;
      if (this.props.cells[(x + 1) + ',' + y]) alive += 1;
      if (this.props.cells[(x - 1) + ',' + (y + 1)]) alive += 1;
      if (this.props.cells[x + ',' + (y + 1)]) alive += 1;
      if (this.props.cells[(x + 1) + ',' + (y + 1)]) alive += 1;

      if (obj[key]) {
        if (alive < 2 || alive > 3) obj[key] = false;
        if (alive === 2 || alive === 3) obj[key] = true;
      } else {
        if (alive === 3) obj[key] = true;
      }
    });

    obj.generation = this.props.generation + 1;

    this.props.dispatch({
      type: 'UPDATE_CELLS',
      data: obj
    });
  }

  render() {
    return (
      <div>
        <div className="grid">
          <svg width={this.props.ROWS * CELL_SIZE} height={this.props.COLS * CELL_SIZE}>
            {this.createGrid()}
          </svg>
        </div>
        <div className="actions">
          <button className="reset" onClick={this.reset}>Reset</button>
          <button className="start" onClick={this.start}>Start</button>
          <button className="pause" onClick={this.pause}>Pause</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    ROWS: state.grid.ROWS,
    COLS: state.grid.COLS,
    cells: state.grid.cells
  };
}

const ConnectedApp = connect(mapStateToProps)(App);

export default ConnectedApp;
