import { background } from 'lib/rpc'

export function newAccount (secret) {
  return background.send({ type: 'NEW_ACCOUNT', secret });
}
