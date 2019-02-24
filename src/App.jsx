import React from 'react';
import { connect } from 'react-redux';
import './App.css';

class Cell extends React.Component {
  getColor() {
    let colors = ['#FF5400', '#FF8E00', '#FFD200', '#00C0FF', '#00D267', '#81E650', '#8B48FE', '#CA41FC', '#FF46FB'];
    return colors[Math.floor(Math.random() * 9)];
  }

  render() {
    return (
      <div
        className="cell"
        style={{ 'backgroundColor': this.props.cell ? 'slategray' : '' }}
        onClick={() => this.props.click(this.props.coord)}>
      </div>
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

    var grid = [];
    for (var i = 0; i < this.props.ROWS; i++) {
      var cells = [];
      for (var j = 0; j < this.props.COLS; j++) {
        var coord = i + "," + j;
        cells.push(<Cell coord={coord} cell={this.props.cells[coord]} click={this.toggle} key={j} />);
      }
      grid.push(<div className="row" key={i}>{cells}</div>);
    }
    return grid;
  }

  toggle(cell) {
    var obj = Object.assign({}, this.props.cells);
    obj[cell] = !obj[cell];

    this.props.dispatch({
      type: 'UPDATE_CELLS',
      data: obj
    })
  }

  reset() {
    this.pause();

    this.props.dispatch({type: 'RESET'});
  }

  start() {
    if (!this.timer) this.timer = setInterval(this.life, 100);
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
          {this.createGrid()}
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
