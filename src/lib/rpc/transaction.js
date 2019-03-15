import { background } from 'lib/rpc'

export async function signTx (tx, txId, blockNonce, secret) {
  try {
    const signed = await background.send({ type: 'TX_SIGN', tx, secret, blockNonce });
    return background.send({ type: 'TX_SIGNED', tx: signed, txId });
  }
  catch (e) {
    return Promise.reject('Authentication Failed.');
  }
}

export function cancelTx (txId) {
  return background.send({ type: 'TX_CANCEL', txId })
}
