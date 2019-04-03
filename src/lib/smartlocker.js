import { providers, utils, Contract, Interface, Wallet } from 'ethers'
import { toHex }                                         from 'lib/helpers'

const provider = new providers.JsonRpcProvider(process.env.RPC_URL);

const smartLockerABI = config.contracts.smartLocker.abi;

// TODO: currently using mockSmartLockerABI for testing
const mockSmartLockerABI = config.contracts.smartLocker.abi;

// TODO: currently using mockSmartLockerRegistrar address and ABI and contract for testing
const mockSmartLockerRegistrarAddress = process.env.REGISTRAR_ADDRESS;
const mockSmartLockerRegistrarABI = config.contracts.registrar.abi;
const mockSmartLockerRegistrarContract = new Contract(mockSmartLockerRegistrarAddress, mockSmartLockerRegistrarABI, provider);
const smartLocker = {

  getNextNonce (smartLockerAddress) {
    const smartLockerContract = new Contract(smartLockerAddress, smartLockerABI, provider);
    return smartLockerContract.getNextNonce();
  },

  createMetaTx (rawTx, sk, smartLockerAddress, smartLockerNonce) {
    const metaTx = {
      from: smartLockerAddress || '0x0',
      to: rawTx.to || '0x0',
      value: rawTx.value || '0x0',
      data: rawTx.data || '0x0',
      nonce: smartLockerNonce ? toHex(smartLockerNonce) : '0x0',
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

  // TODO: remove this when gas relayers
  encodeExecuteSigned (metaTx) {
    const executeSigned = new Interface(smartLockerABI).functions.executeSigned(
      metaTx.to, metaTx.value, metaTx.data, metaTx.gasPrice, metaTx.gasLimit, metaTx.signature
    );
    return executeSigned.data;
  },

  getState (deviceAddress, smartLockerAddress) {

    // TODO: uncomment one of these for convenient test cases (or use popLocker.setSmartLockerAddress from DApp)
    //smartLockerAddress = '0x0000000000000000000000000000000000000000'; // TEST 0
    //smartLockerAddress = '0xa1d039920e2068aba485ad2efda270b2e5ee85a2'; // TEST 1
    //smartLockerAddress = '0x828fe0786cf4284d7114614b5632fb754b538536'; // TEST 2
    //smartLockerAddress = '0x1207c7f2575d5413e6d9f6c53a15f2d5a2761c1d'; // TEST 3
    //smartLockerAddress = '0x2210616d67a8be68a72325ad93e9d4dbe7fc6f42'; // TEST 4

    // TODO: clear up nested catches
    return new Promise(resolve => {
      let lockerState = {
        registrar: {
          address: mockSmartLockerRegistrarAddress
        }
      }

      if (!smartLockerAddress) {
        resolve({...lockerState, status: 'simple' });
      } else {
        mockSmartLockerRegistrarContract.getName(smartLockerAddress).then(name => {
          if (name) {
            const mockSmartLockerContract = new Contract(smartLockerAddress, mockSmartLockerABI, provider);
            mockSmartLockerContract.isKey(deviceAddress).then(isKey => {
              if (isKey) {
                mockSmartLockerContract.getKeyCount().then(keyCount => {

                  lockerState = {
                    ...lockerState,
                    name,
                    status: 'smart',
                    deviceAddress,
                    smartLockerAddress
                  }

                  if (keyCount < 2) {
                    resolve({...lockerState, onlyKey: true});
                  } else {
                    resolve(lockerState);
                  }
                })
              }
              else resolve({...lockerState, status: 'pending', name });
            })
          }
          else resolve({...lockerState, status: 'pending' });
        }).catch(() => resolve({ status: 'error' }))
      }
    });
  }
}

export default smartLocker;
