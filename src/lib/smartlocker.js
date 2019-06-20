import { providers, utils, Contract, Interface, Wallet } from 'ethers'

const provider = new providers.JsonRpcProvider(process.env.RPC_URL);

const smartLockerRegistrarAddress = process.env.REGISTRAR_ADDRESS;
const smartLockerRegistrarABI = config.contracts.registrar.abi;
const smartLockerRegistrarContract = new Contract(smartLockerRegistrarAddress, smartLockerRegistrarABI, provider);

const smartLockerABI = config.contracts.smartLocker.abi;
const smartLocker = {

  getNextNonce (smartLockerAddress) {
    const smartLockerContract = new Contract(smartLockerAddress, smartLockerABI, provider);
    return smartLockerContract.getNextNonce().then((r) => r.toHexString());
  },

  createMetaTx (rawTx, sk, smartLockerAddress, smartLockerNonce) {
    const metaTx = {
      from: smartLockerAddress || '0x0000000000000000000000000000000000000000',
      to: rawTx.to || '0x0000000000000000000000000000000000000000',
      value: rawTx.value || '0x0',
      data: rawTx.data || '0x0',
      nonce: smartLockerNonce || '0x0',
      gasPrice: rawTx.gasPrice || '0x0',
      gasLimit: rawTx.gasLimit || '0x0'
    };

    const hash = utils.solidityKeccak256(
      ['address', 'address', 'uint', 'bytes', 'uint256', 'uint', 'uint'],
      [metaTx.from, metaTx.to, metaTx.value, metaTx.data, metaTx.nonce, metaTx.gasPrice, metaTx.gasLimit]
    );

    metaTx.signature = new Wallet(sk).signMessage(utils.arrayify(hash));
    return metaTx;
  },

  getState (deviceAddress, smartLockerAddress) {

    // TODO: clear up nested catches
    return new Promise(resolve => {
      let lockerState = {
        registrar: {
          address: smartLockerRegistrarAddress
        }
      }

      if (!smartLockerAddress) {
        resolve({...lockerState, status: 'simple' });
      } else {
        smartLockerRegistrarContract.getName(smartLockerAddress).then(bytes => {
          const name = this.bytes32ToUtf8(bytes);
          if (name) {
            const smartLockerContract = new Contract(smartLockerAddress, smartLockerABI, provider);
            smartLockerContract.isAuthorisedKey(deviceAddress).then(isKey => {
              if (isKey) {
                smartLockerContract.getAuthorisedKeyCount().then(keyCount => {

                  lockerState = {
                    ...lockerState,
                    name,
                    status: 'smart',
                    deviceAddress,
                    smartLockerAddress
                  }

                  if (keyCount < 2) {
                    resolve({ ...lockerState, onlyKey: true })
                  } else {
                    resolve(lockerState);
                  }
                }).catch(() => resolve({ status: 'error' }))
              }
              else resolve({ ...lockerState, status: 'pending', name, deviceAddress })
            }).catch(() => resolve({ status: 'error' }))
          }
          else resolve({ ...lockerState, status: 'invalid' })
        }).catch(() => resolve({ status: 'error' }))
      }
    });
  },

  getName (address) {
    return smartLockerRegistrarContract.getName(address).then(this.bytes32ToUtf8);
  },

  bytes32ToUtf8 (bytes) {
    return utils.toUtf8String(bytes).replace(/[\u0000]/g, '');
  }
}

export default smartLocker;
