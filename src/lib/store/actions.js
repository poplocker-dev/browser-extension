import { delegateTo } from 'lib/messaging'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch(accountProcessed());
    delegateTo.background({ type: 'ACCOUNT_GEN', secret })
      .then(account => dispatch(accountReady(account.address)))
      .catch(() => dispatch(accountFailed()));
  }
}

export function txSign (secret) {
  return function (dispatch) {
    delegateTo.background({ type: 'TX_SIGN', secret })
      .then(() => dispatch(txSigned()))
      .catch(() => dispatch(txSignFailed()));
  }
}

export function txSigned () {
  return {
    type: 'TX_SIGNED'
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
    type: 'ENQ_PENDING_TXS',
    pending
  }
}
