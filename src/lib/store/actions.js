import { delegateTo }  from 'lib/messaging'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch({ type: 'ACCOUNT_GEN' });
    delegateTo
      .background({ type: 'ACCOUNT_GEN', secret })
      .then(account => dispatch(accountReady(account.address)))
      .catch(() => dispatch(accountFailed()));
  }
}

export function signTransaction (transaction, secret) {
  return function (dispatch) {
    delegateTo
      .background({ type: 'TX_SIGN', transaction, secret })
      .then(signed => {
        dispatch(txSigned(signed));
        delegateTo
          .background(txSigned(signed))
          .then(window.close)})
      .catch(() => dispatch(txSignFailed('Authentication Failed.')))
  }
}

export function cancelTransaction () {
  return function () {
    delegateTo
      .background({ type: 'TX_CANCEL' })
      .then(window.close);
  }
}

export function fetchTxInfo (transaction) {
  return async function (dispatch) {
    const results = await delegateTo.background({ type: 'TX_INFO', transaction });

    dispatch(update('pricing', results.map(r => r.result)));
  }
}

export function updatePricing (pricing) {
  return async function (dispatch) {
    dispatch(update('pricing', [pricing.balance, pricing.gasPrice, pricing.gasEstimate]));
  }
}

export function enqueuePending (pending) {
  return { type: 'ENQUEUE_TXS', pending };
}

export function txSigned (tx) {
  return {
    type: 'TX_SIGNED',
    tx
  }
}

export function txSignFailed (message) {
  return {
    type: 'TX_SIGN_FAILED',
    message
  }
}

export function loader (entity) {
  return {
    type: 'LOADING',
    entity
  }
}

export function accountReady (address) {
  return {
    type: 'ACCOUNT_READY',
    address
  }
}

export function accountFailed () {
  return {
    type: 'ACCOUNT_FAILED'
  }
}

export function update (prop, value) {
  return {
    type: 'UPDATE',
    prop,
    value
  }
}
