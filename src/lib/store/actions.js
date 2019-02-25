import { delegateTo }  from 'lib/rpc'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch({ type: 'ACCOUNT_GEN' });
    delegateTo
      .background({ type: 'ACCOUNT_GEN', secret })
      .then(account => dispatch(accountReady(account.deviceAddress)))
      .catch(() => dispatch(accountFailed()));
  }
}

export function accountReady (deviceAddress) {
  return {
    type: 'ACCOUNT_READY',
    deviceAddress
  }
}

export function accountFailed () {
  return {
    type: 'ACCOUNT_FAILED'
  }
}

export function signTransaction (tx, txId, blockNonce, secret) {
  return function (dispatch) {
    delegateTo.background({ type: 'TX_SIGN', tx, secret, blockNonce })
      .then(signed => {
        delegateTo
          .background({ type: 'TX_SIGNED', tx: signed, txId })
          .then(window.close)})
      .catch(() => dispatch(txSignFailed('Authentication Failed.')))
  }
}

export function cancelTransaction (txId) {
  return function () {
    delegateTo
      .background({ type: 'TX_CANCEL', txId })
      .then(window.close);
  }
}

export function txInfoFailed (message) {
  return {
    type: 'TX_INFO_FAILED',
    message
  }
}


export function updatePricing (pricing) {
  return {
    type: 'UPDATE_PRICING',
    pricing
  }
}

export function updateBlockNonce (nonce) {
  return {
    type: 'UPDATE_NONCE',
    nonce
  }
}

export function enqueuePending (pending) {
  return { type: 'ENQUEUE_TXS', pending };
}

export function txSignFailed (message) {
  return {
    type: 'TX_SIGN_FAILED',
    message
  }
}

export function noFunds (message) {
  return {
    type: 'NO_FUNDS',
    message
  }
}

export function loader (entity) {
  return {
    type: 'LOADING',
    entity
  }
}


export function toggleAdvanced () {
  return {
    type: 'TOGGLE_ADVANCED'
  }
}
