import { Web3Provider, EthereumProvider } from 'lib/providers'

if (typeof window.web3 !== 'undefined' || typeof window.ethereum !== 'undefined') {
  throw(new Error('Another web3 instance in use!'));
} else {
  window.web3 = { currentProvider: new Web3Provider() };
  window.ethereum = new EthereumProvider();
}
