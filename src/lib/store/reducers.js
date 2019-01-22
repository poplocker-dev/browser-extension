import { combineReducers } from 'redux'

function address (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
  }
  else return state;
}

function pending (state = [], action) {
  if (action.type == 'ENQUEUE_TXS') {
    const txs = action.pending.map(({params, origin}) => ({...params[0], origin }));

    return { current: txs[0], all: txs }
  }
  else
    return state;
}

function pricing (state = { balance: 0, gasPrice: 0, gasEstimate: 0 }, action) {
  if (action.type == 'UPDATE' && action.prop == 'pricing') {
    const [ balance, gasPrice, gasEstimate ] = action.value;
    return { balance, gasPrice, gasEstimate }
  }
  else return state;
}

function errors (state = {}, action) {
  if (action.type == 'TX_SIGN_FAILED') {
    return {...state, txSign: action.message };
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

const transaction = combineReducers({ pricing, pending });
const reducers    = combineReducers({ address, page, transaction, errors });

export default reducers;
