import { combineReducers } from 'redux'

function address (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
  }
  else return state;
}

function processed (state, action) {
  if (action.type == 'KEY_GEN') {
    return true
  }
  else return false;
}

const reducers = combineReducers({ address, processed });

export default reducers;
