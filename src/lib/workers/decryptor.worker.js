import SimpleCrypto from 'simple-crypto-js'

onmessage = e => {
  const sk = (new SimpleCrypto(e.data.secret + e.data.salt)).decrypt(e.data.encrypted);
  if (sk)
    postMessage(sk);
  else
    throw(new Error('Authentication failed!'));
};
