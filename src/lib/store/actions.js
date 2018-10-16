import { sendToBackground } from 'lib/messaging'

// TODO: use secret to encrypt pk in storage
export function newAccount (secret) {
  return function (dispatch) {
    sendToBackground({ type: 'KEY_GEN' })
      .then(address => dispatch(accountReady(address)))
      .catch(error  => dispatch(accountFailed(error)));
  }
}

export function accountReady ({ address }) {
  return {
    type: 'ACCOUNT_READY',
    address
  }
}

export function accountFailed (error) {
  return {
    type: 'ACCOUNT_FAILED',
    error
  }
}
