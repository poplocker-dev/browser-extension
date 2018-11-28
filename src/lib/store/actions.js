import { delegateTo } from 'lib/messaging'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch(accountProcessed());
    delegateTo.background({ type: 'ACCOUNT_GEN', secret })
      .then(account => dispatch(accountReady(account.address)))
      .catch(() => dispatch(accountFailed()));
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

export function enqAuth (message, callback) {
  return {
    type: 'ENQ_AUTH',
    message,
    callback
  }
}
