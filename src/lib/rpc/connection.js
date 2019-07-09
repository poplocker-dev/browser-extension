import { background } from 'lib/rpc'

export function approve (request) {
  return background.send({ type: 'CONNECT_DAPP', request });
}

export function reject (request) {
  return background.send({ type: 'REJECT_DAPP', request });
}
