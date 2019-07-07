import { combineReducers } from 'redux'
import reduceReducers      from 'reduce-reducers';
import toBN                from 'number-to-bn'
import { toHex }           from 'lib/helpers'

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

  if (action.type == 'REVALUE_TX' && state) {
    const value = toBN(action.value).sub(toBN(action.fee));
    const params = { ...state.params, value: toHex(value.lt('0') ? '0' : value) };
    return { ...state, params };
  }
  else
    return state;
}

function balance (state = null, action) {
  if (action.type == 'UPDATE_BALANCE')
    return toBN(action.balance);
  else
    return state;
}

function connections (state = [], action) {
  if (action.type == 'ENQUEUE_CONNS') {
    return action.connections;
  }
  else
    return state;
}

function pricing (state = null, action) {
  if (action.type == 'UPDATE_PRICING') {
    const [gasPrice, gasEstimate] = action.pricing.map(toBN);
    return { gasPrice, gasEstimate, fee: gasPrice.mul(gasEstimate) }
  }
  else
    return state;
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
  case 'ACCOUNT_FAILED':
    return 'failure';
  case 'ENQUEUE_TXS':
    return 'authorize';
  case 'ENQUEUE_CONNS':
    return 'connect';
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
const tx       = combineReducers({ balance, pricing, current });
const errors   = combineReducers({ txInfo: txInfoError, txSign: txSignError, noFunds: noFundsError });
const reducers = combineReducers({ page, tx, errors, advancedMode, connections });

export { reducers };
