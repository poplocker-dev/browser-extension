import { background } from 'lib/rpc'

export function newAccount (secret) {
  return background.send({ type: 'NEW_ACCOUNT', secret });
}

export function changePassword (oldSecret, newSecret) {
  return background.send({ type: 'CHANGE_PASSWORD', oldSecret, newSecret });
}
