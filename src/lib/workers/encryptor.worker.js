import SimpleCrypto from 'simple-crypto-js'

onmessage = e => {

  const salt          = SimpleCrypto.generateRandom(256);
  const encrypted     = (new SimpleCrypto(e.data.secret + salt)).encrypt(e.data.sk);

  postMessage({ salt, encrypted });
};
