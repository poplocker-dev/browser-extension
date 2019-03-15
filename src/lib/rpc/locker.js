import { background } from 'lib/rpc'

export function getSmartLockerState () {
  return background.send({ type: 'POPLOCKER_API', method: 'getSmartLockerState' });
}
