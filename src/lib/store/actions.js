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

export function signTransaction (transaction, secret, txId) {
  return function (dispatch) {
    delegateTo
      .background({ type: 'TX_SIGN', transaction, secret })
      .then(signed => {
        dispatch(txSigned(signed, txId));
        delegateTo
          .background(txSigned(signed, txId))
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

export function fetchTxInfo (transaction) {
  return async function (dispatch) {
    try {
      const results = await delegateTo.background({ type: 'TX_INFO', transaction });
      dispatch(update('pricing', results.map(r => r.result)));
    }
    catch(e) {
      dispatch(txSignFailed('Transaction will fail.'));
    }
  }
}

export function updatePricing ({ balance, gasPrice, gasEstimate }) {
  return async function (dispatch) {
    dispatch(update('pricing', [balance, gasPrice, gasEstimate]));
  }
}

export function enqueuePending (pending) {
  return { type: 'ENQUEUE_TXS', pending };
}

export function txSigned (tx, txId) {
  return {
    type: 'TX_SIGNED',
    tx,
    txId
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

export function toggleAdvanced () {
  return {
    type: 'TOGGLE_ADVANCED'
  }
}
