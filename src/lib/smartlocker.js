import { providers, utils, Contract, Interface, Wallet } from 'ethers'
import keyRequests                                       from 'lib/key_requests'

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
      gasLimit: rawTx.gasLimit? utils.bigNumberify(rawTx.gasLimit).mul(2).toHexString() : '0x0'
    };

    const hash = utils.solidityKeccak256(
      ['address', 'address', 'uint', 'bytes', 'uint256', 'uint', 'uint'],
      [metaTx.from, metaTx.to, metaTx.value, metaTx.data, metaTx.nonce, metaTx.gasPrice, metaTx.gasLimit]
    );

    metaTx.signature = new Wallet(sk).signMessage(utils.arrayify(hash));
    return metaTx;
  },

  getState (deviceAddress, smartLockerAddress) {

    return new Promise(resolve => {
      let lockerState = {
        registrar: {
          address: smartLockerRegistrarAddress
        }
      }

      if (!smartLockerAddress) {
        resolve({...lockerState, status: 'simple' });
      } else {
        smartLockerRegistrarContract.getName(smartLockerAddress)
                                    .then(bytes => {

          const name = this.bytes32ToUtf8(bytes);
          if (name) {
            const smartLockerContract = new Contract(smartLockerAddress, smartLockerABI, provider);
            smartLockerContract.isAuthorisedKey(deviceAddress)
                               .then(isKey => {

              if (isKey) {
                smartLockerContract.getKeyList()
                                   .then(keyList => keyList.filter(address => address > 0))
                                   .then(keyList => {

                  Promise.all(keyList.map(address => smartLockerContract.getKey(address)))
                         .then(keys => keys.map((bytes, index) => ({ address: keyList[index], name: this.bytes32ToUtf8(bytes) })))
                         .then(keys => {

                           keyRequests.fetch()
                                      .then(requests => {

                             lockerState = {
                               ...lockerState,
                               name,
                               status: 'smart',
                               deviceAddress,
                               smartLockerAddress
                             }
                             resolve({ ...lockerState, keys, requests })

                           }).catch(() => resolve({ status: 'error' }))
                         }).catch(() => resolve({ status: 'error' }))
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

  isAuthoriszedKey (smartLockerAddress, keyAddress) {
    const smartLockerContract = new Contract(smartLockerAddress, smartLockerABI, provider);
    return smartLockerContract.isAuthorisedKey(keyAddress);
  },

  bytes32ToUtf8 (bytes) {
    return utils.toUtf8String(bytes).replace(/[\u0000]/g, '');
  }
}

export default smartLocker;
