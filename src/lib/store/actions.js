export function accountGenerated () {
  return { type: 'ACCOUNT_GEN' };
}

export function accountReady () {
  return {
    type: 'ACCOUNT_READY'
  }
}

export function accountFailed () {
  return {
    type: 'ACCOUNT_FAILED'
  }
}

export function txInfoFailed (message) {
  return {
    type: 'TX_INFO_FAILED',
    message
  }
}

export function updateBalance (balance) {
  return {
    type: 'UPDATE_BALANCE',
    balance
  }
}

export function updatePricing (pricing) {
  return {
    type: 'UPDATE_PRICING',
    pricing
  }
}

export function revalueTx (fee, value) {
  return {
    type: 'REVALUE_TX',
    fee,
    value
  }
}

export function enqueuePending (pending) {
  return { type: 'ENQUEUE_TXS', pending };
}

export function enqueueConnections (connections) {
  return { type: 'ENQUEUE_CONNS', connections };
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

export function updateSmartLocker (state) {
  return {
    type: 'SMARTLOCKER_UPDATE',
    state
  }
}

export function setToLocker (toLocker) {
  return {
    type: 'SET_TO_LOCKER',
    toLocker
  }
}
