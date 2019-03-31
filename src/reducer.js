import { combineReducers } from 'redux';

function randomState() {
  var initialState = {
    ROWS: 40,
    COLS: 40,
    cells: {}
  }
  for (var i = 0; i < initialState.ROWS; i++) {
    for (var j = 0; j < initialState.COLS; j++) {
      var coord = [i + "," + j];
      initialState.cells[coord] = i % 2 === Math.round(Math.random());
    }
  }
  return initialState;
}

function grid(state = randomState(), action) {
  switch (action.type) {
    case('UPDATE_CELLS'):
      return Object.assign({}, state, { cells: action.data });
    case('RESET'):
      return Object.assign({}, state, randomState());
    default: 
      return state;
  }
}

export default combineReducers({grid});
