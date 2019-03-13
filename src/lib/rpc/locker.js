import { background } from 'lib/rpc'

export function generateDeviceAddress (secret) {
  return send({ method: 'generateDeviceAddress', secret });
}

export function getSmartLockerState () {
  return send({ method: 'getSmartLockerState' });
}

// dispatches to PopLocker's
// SmartLocker contract
function send (payload) {
  return background.send({ type: 'POPLOCKER_API', ...payload })
                   .then(response => response.result);
}
