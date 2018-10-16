import { sendToBackground } from 'lib/messaging'

export function newAccount (secret) {
  return function (dispatch) {
    dispatch(accountProcessed());
    sendToBackground({ message: 'KEY_GEN', secret })
      .then(address => dispatch(accountReady(address)))
      .catch(() => dispatch(accountFailed()));
  }
}

export function accountProcessed () {
  return {
    type: 'ACCOUNT_PROCESSED'
  }
}

export function accountReady ({ address }) {
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
