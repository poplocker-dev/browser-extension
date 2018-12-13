import { combineReducers } from 'redux'

function address (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
  }
  else return state;
}

function processed (state, action) {
  if (action.type == 'PROCESSED') {
    return true
  }
  else return false;
}

function pending (state = [], action) {
  if (action.type == 'ENQUEUE_TXS') {
    return action.pending;
  }
  else return state;
}

function gasPrice (state = 0, action) {
  if (action.type == 'ENQUEUE_TXS') {
    return action.price;
  }
  else return state;
}

function page (state = 'NewAccountView', action) {
  switch (action.type) {
    case 'PROCESSED':
      return 'LoadingView';
    case 'ACCOUNT_READY':
      return 'SuccessView';
    case 'ENQUEUE_TXS':
      return 'AuthorizeView';
    default:
      return state;
  }
}

const reducers = combineReducers({ address, processed, page, pending, gasPrice });

export default reducers;
