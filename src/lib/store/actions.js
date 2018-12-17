import { delegateTo } from 'lib/messaging'
import { load } from 'lib/storage'

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

export function enqueuePending () {
  return function (dispatch) {
    load('pending').then(pending => {
      if (pending && pending.length > 0)
        dispatch({ type: 'ENQUEUE_TXS', pending });
    });
  }
}

export function fetchBalance () {
  return function (dispatch) {
    load('address').then(address => {
      if (address) {
        delegateTo
          .background({ type: 'ACCOUNT_BALANCE', address })
          .then(balance => dispatch(updateBalance(balance)));
      }
    });
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

export function updateBalance (balance) {
  return {
    type: 'UPDATE_BALANCE',
    balance
  }
}

