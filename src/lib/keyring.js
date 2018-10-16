import * as wallet from 'ethereumjs-wallet'

export function generateKeypair () {
  return new Promise((resolve, reject) => {
    try {
      const keys = wallet.generate();
      resolve({
        pk: keys.getPrivateKey(),
        pub: keys.getPublicKey(),
        address: keys.getChecksumAddressString()
      });
    }
    catch(error) {
      reject(error);
    }
  });
}
