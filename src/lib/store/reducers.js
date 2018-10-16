import { combineReducers } from 'redux'

function account (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
  }
  else return state;
}

const reducers = combineReducers({ account });

export default reducers;
