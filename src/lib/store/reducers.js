import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers';
import toBN from 'number-to-bn'

// TODO: improve this abomination ✝!
const NewAccountView = React.lazy(() => import('../../popup/views/new_account'));
const LoadingView    = React.lazy(() => import('../../popup/views/loading'));
const SuccessView    = React.lazy(() => import('../../popup/views/success'));
const AuthorizeView  = React.lazy(() => import('../../popup/views/authorize'));

function address (state = null, action) {
  if (action.type == 'ACCOUNT_READY') {
    return action.address
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

// TODO: better errors handling
function errors (state = {}, action) {
  if (action.type == 'TX_SIGN_FAILED') {
    return {...state, txSign: action.message };
  }
  else return state;
}

function advancedMode (state = false, action) {
  if (action.type == 'TOGGLE_ADVANCED')
    return !state;
  else
    return state;
}

function page (state = NewAccountView, action) {
  switch (action.type) {
    case 'ACCOUNT_GEN':
      return LoadingView;
    case 'ACCOUNT_READY':
      return SuccessView;
    case 'ENQUEUE_TXS':
      return AuthorizeView;
    default:
      return state;
  }
}

const current  = reduceReducers(pending, firstPending);
const tx       = combineReducers({ pricing, pending, current });
const reducers = combineReducers({ address, page, tx, errors, advancedMode });

export { reducers };
