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
  if (action.type == 'UPDATE' && action.prop == 'txBalance') {
    return action.value;
  }
  else return state;
}

function gasPrice (state = 0, action) {
  if (action.type == 'UPDATE' && action.prop == 'txGasPrice') {
    return action.value;
  }
  else return state;
}

function gasEstimate (state = 0, action) {
  if (action.type == 'UPDATE' && action.prop == 'txGasEstimate') {
    return action.value;
  }
  else return state;
}

function value (state = 0, action) {
  if (action.type == 'UPDATE' && action.prop == 'txValue') {
    return action.value;
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

const transaction = combineReducers({ gasPrice, gasEstimate, value })
const reducers    = combineReducers({ address, balance, page, pending, transaction });

export default reducers;
