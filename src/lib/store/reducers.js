import { combineReducers } from 'redux'
import reduceReducers      from 'reduce-reducers'
import toBN                from 'number-to-bn'
import { toHex }           from 'lib/helpers'

function pendingCnxs (state = [], action) {
  if (action.type == 'ENQUEUE_CNXS') {
    return action.cnxs;
  }
  else
    return state;
}

function pendingTxs (state = [], action) {
  if (action.type == 'ENQUEUE_TXS') {
    return action.txs.map(({params, origin, txId}) => {
      return { params: params[0], origin, txId }
    });
  }
  else
    return state;
}

function firstPendingTx (state = null, action) {
  if (action.type == 'ENQUEUE_TXS')
    return (state.length > 0) ? state[0] : null;

  } else if (action.type == 'REVALUE_TX' && state) {
    const value = toBN(action.value).sub(toBN(action.fee));
    const params = { ...state.params, value: toHex(value.lt('0') ? '0' : value) };
    return { ...state, params };

  } else if (action.type == 'SET_TO_LOCKER' && state) {
    return { ...state, toLocker: action.toLocker };
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

function pricing (state = null, action) {
  if (action.type == 'UPDATE_PRICING') {
    const [gasPrice, gasEstimate, overhead] = action.pricing.map(toBN);
    return { gasPrice, gasEstimate, overhead, fee: gasPrice.mul(gasEstimate.add(overhead)) }
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
    case 'ENQUEUE_CNXS':
     return 'connect';
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

function locker(state = { status: null }, action) {
  if (action.type == 'SMARTLOCKER_UPDATE') {
    return action.state;
  }
  else
    return state;
}

const current  = reduceReducers(pendingTxs, firstPendingTx);
const tx       = combineReducers({ balance, pricing, current });
const errors   = combineReducers({ txInfo: txInfoError, txSign: txSignError, noFunds: noFundsError });
const reducers = combineReducers({ pendingCnxs, page, tx, errors, advancedMode, locker });

export { reducers };
