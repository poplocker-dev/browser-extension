import { background } from 'lib/rpc'

export async function approve () {
  return background.send({ type: 'CONNECT_DAPP' });
}

export async function reject () {
  return background.send({ type: 'REJECT_DAPP' });
}
