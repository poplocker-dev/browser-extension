import { background } from 'lib/rpc'

export function authorizeCnx (request) {
  return background.send({ type: 'CNX_AUTHORIZED', request });
}

export function rejectCnx (request) {
  return background.send({ type: 'CNX_REJECTED', request });
}
