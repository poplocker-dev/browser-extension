import { background } from 'lib/rpc'

export function generateDeviceAddress (secret) {
  return background.send({ type: 'SMART_LOCKER', method: 'generateDeviceAddress', secret });
}

export function getSmartLockerState () {
  return background.send({ type: 'POPLOCKER_API', method: 'getSmartLockerState' });
}
