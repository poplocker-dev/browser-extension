import { background } from 'lib/rpc'

export function getSmartLockerState () {
  return background.send({ type: 'POPLOCKER_API', method: 'getSmartLockerState' });
}

export function getSmartLockerName (address) {
  return background.send({ type: 'SMARTLOCKER_NAME', address });
}
