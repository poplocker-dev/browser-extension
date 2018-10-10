import { combineReducers } from 'redux';

function account(state = null, action) {
  if (action.type == 'NEW_ACCOUNT') {
    //NOOP for now
    return state
  }
  else return state
}

const reducers = combineReducers({ account });

export default reducers;
