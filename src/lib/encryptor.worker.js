import * as wallet from 'ethereumjs-wallet'

onmessage = e => {

  const keys = wallet.generate();
  const address = keys.getChecksumAddressString();
  const encrypted = keys.toV3(e.data.secret);

  postMessage({ address, encrypted })
};
