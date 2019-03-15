import { Web3Provider, PopLockerProvider } from 'lib/proxy_provider'

if (typeof window.web3 !== 'undefined') {
  throw(new Error('Another web3 instance in use!'));
}
else {
  window.web3 = { currentProvider: new Web3Provider() };
  window.popLocker = new PopLockerProvider();
}
