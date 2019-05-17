import { background } from 'lib/rpc'
import { connection } from 'lib/storage'

export async function approve (request) {
  return background.send({ type: 'CONNECT_DAPP', request });
}

export async function reject (request) {
  return background.send({ type: 'REJECT_DAPP', request });
}
