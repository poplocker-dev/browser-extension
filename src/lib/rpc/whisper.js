import { account } from 'lib/storage'
import Web3        from 'web3'

class ShhRpc {
  constructor (symKey) {
    // TODO: no magic numbers!
    this.params = {
      ttl: 300,
      priority: 1,
      powTarget: 2.01,
      powTime: 100
    }
    this.symKey   = symKey;
    this.symKeyID = null;
    this.web3     = new Web3(process.env.SHH_URL, null);
  }

  async post (data) {
    const address  = await account.address.locker();
    const symKeyID = this.symKeyID;
    const payload  = this.web3.utils.asciiToHex(data);
    const topic    = this.web3.utils.toHex(address.slice(0,8));

    if (this.symKeyID)
      return this.web3.shh.post({ ...this.data, symKeyID, topic, payload });
    else {
      this.symKeyID = await this.web3.shh.addSymKey(this.symKey);
      this.post(data);
    }
  }
}

export default ShhRpc;

