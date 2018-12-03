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

function pending (state = [], action) {
  if (action.type == 'ENQUEUE_PENDING_TXS') {
    return action.pending;
  }
  else return state;
}

function page (state = 'NewAccountView', action) {
  switch (action.type) {
    case 'ACCOUNT_PROCESSED':
      return 'LoadingView';
    case 'ACCOUNT_READY':
      return 'SuccessView';
    default:
      return state;
  }
}

const reducers = combineReducers({ address, processed, page, pending });

export default reducers;
