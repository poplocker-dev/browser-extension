import { combineReducers } from 'redux'

function address (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
  }
  else return state;
}

function pending (state = [], action) {
  if (action.type == 'ENQUEUE_TXS') {
    return action.pending;
  }
  else return state;
}

function balance (state = 0, action) {
  if (action.type == 'UPDATE_BALANCE') {
    return action.balance;
  }
  else return state;
}

function page (state = 'NewAccountView', action) {
  switch (action.type) {
    case 'ACCOUNT_GEN':
      return 'LoadingView';
    case 'ACCOUNT_READY':
      return 'SuccessView';
    case 'ENQUEUE_TXS':
      return 'AuthorizeView';
    default:
      return state;
  }
}



const reducers = combineReducers({ address, page, pending, balance });

export default reducers;
