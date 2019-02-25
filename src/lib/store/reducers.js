import { combineReducers } from 'redux'
import reduceReducers      from 'reduce-reducers';
import toBN                from 'number-to-bn'

function deviceAddress (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.deviceAddress
  }
  else return state;
}

function pending (state = [], action) {
  if (action.type == 'ENQUEUE_TXS') {
    return action.pending.map(({params, origin, txId}) => {
      return { params: params[0], origin, txId }
    });
  }
  else
    return state;
}

function firstPending (state = null, action) {
  if (action.type == 'ENQUEUE_TXS')
    return (state.length > 0) ? state[0] : null;
  else
    return state;
}

function pricing (state = null, action) {
  if (action.type == 'UPDATE_PRICING') {
    const [balance, gasPrice, gasEstimate] = action.pricing.map(toBN);
    return { balance, gasPrice, gasEstimate, fee: gasPrice.mul(gasEstimate) }
  }
  else return state;
}

function blockNonce (state = null, action) {
  if (action.type == 'UPDATE_NONCE') {
    return action.nonce;
  }
  else return state;
}

function advancedMode (state = false, action) {
  if (action.type == 'TOGGLE_ADVANCED')
    return !state;
  else
    return state;
}

function page (state = 'new_account', action) {
  switch (action.type) {
    case 'ACCOUNT_GEN':
      return 'loading';
    case 'ACCOUNT_READY':
      return 'success';
    case 'ENQUEUE_TXS':
      return 'authorize';
    default:
      return state;
  }
}

function txInfoError (state = null, action) {
  if (action.type == 'TX_INFO_FAILED')
    return action.message;
  else
    return state;
}

function txSignError (state = null, action) {
  if (action.type == 'TX_SIGN_FAILED')
    return action.message;
  else
    return state;
}

function noFundsError (state = null, action) {
  if (action.type == 'NO_FUNDS')
    return action.message;
  else
    return state;
}

const current  = reduceReducers(pending, firstPending);
const tx       = combineReducers({ pricing, pending, current, blockNonce });
const errors   = combineReducers({ txInfo: txInfoError, txSign: txSignError, noFunds: noFundsError });
const reducers = combineReducers({ deviceAddress, page, tx, errors, advancedMode });

export { reducers };
