import * as wallet  from 'ethereumjs-wallet'
import SimpleCrypto from 'simple-crypto-js'

onmessage = e => {

  const keys          = wallet.generate();
  const deviceAddress = keys.getChecksumAddressString();
  const sk            = keys.getPrivateKeyString();
  const salt          = SimpleCrypto.generateRandom(256);
  const encrypted     = (new SimpleCrypto(e.data.secret + salt)).encrypt(sk);

  postMessage({ deviceAddress, salt, encrypted });
};
