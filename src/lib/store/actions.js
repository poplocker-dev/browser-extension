import { delegateTo }  from 'lib/messaging'
import { transaction } from 'lib/storage'

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
          .background(txSigned(signed))})
      .catch(() => dispatch(txSignFailed()))
  }
}

export function cancelTransaction () {
  return function (dispatch) {
    delegateTo
      .background({ type: 'TX_CANCEL' })
      .then(window.close);
  }
}

export function fetchTxInfo () {
  return async function (dispatch) {
    const [first] = await transaction.pending();
    const params  = first.params[0];
    const results = await delegateTo.background({ type: 'TX_INFO', params });

    const [ balance, gasPrice, gasEstimate ] = results.map(r => r.result);

    dispatch(update('txGasEstimate', gasEstimate));
    dispatch(update('txGasPrice', gasPrice));
    dispatch(update('txBalance', balance));
    dispatch(update('txValue', params.value));
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

export function txSignFailed () {
  return {
    type: 'TX_SIGN_FAILED'
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
