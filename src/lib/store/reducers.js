import React from 'react'
import toBN                from 'number-to-bn'
import { combineReducers } from 'redux'

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

    const txs = action.pending.map(({params, origin, txId}) => {
      return { params: params[0], origin, txId }
    });

    return { current: txs[0], all: txs }
  }
  else
    return state;
}

// TODO: change defaults to null and update initial state depending on these values
// unsettled state should not be treated as error
function pricing (state, action) {
  state = state || {
    fee         : toBN(0),
    balance     : toBN(0),
    gasPrice    : toBN(0),
    gasEstimate : toBN(0)
  }

  if (action.type == 'UPDATE' && action.prop == 'pricing') {
    const [balance, gasPrice, gasEstimate] = action.value.map(toBN);

    return { balance, gasPrice, gasEstimate, fee: gasPrice.mul(gasEstimate) }
  }

  else return state;
}

function errors (state = {}, action) {
  if (action.type == 'TX_SIGN_FAILED') {
    return {...state, txSign: action.message };
  }
  else return state;
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

function advancedMode (state = false, action) {
  if (action.type == 'TOGGLE_ADVANCED')
    return !state;
  else
    return state;
}

const transaction = combineReducers({ pricing, pending });
const reducers    = combineReducers({ address, page, transaction, errors, advancedMode });

export default reducers;
