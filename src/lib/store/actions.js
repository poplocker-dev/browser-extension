import { delegateTo } from 'lib/messaging'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch(accountProcessed());
    delegateTo.background({ type: 'ACCOUNT_GEN', secret })
              .then(account => dispatch(accountReady(account.address)))
              .catch(() => dispatch(accountFailed()));
  }
}

export function signTransaction (transaction, secret) {
  return function (dispatch) {
    delegateTo.background({ type: 'TX_SIGN', transaction, secret })
              .then(signed => {
                dispatch(txSigned(signed));
                delegateTo.background(txSigned(signed));
              }).catch(() => dispatch(txSignFailed()))
  }
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

export function accountProcessed () {
  return {
    type: 'ACCOUNT_PROCESSED'
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

export function processPending (pending) {
  return {
    type: 'ENQUEUE_PENDING_TXS',
    pending
  }
}
