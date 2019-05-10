import Web3        from 'web3'

class ShhRpc {
  constructor (url, symKey) {
    // TODO: no magic numbers!
    this.params = {
      ttl: 300,
      priority: 1,
      powTarget: 2.01,
      powTime: 100
    }
    this.symKey   = symKey;
    this.symKeyID = null;
    this.web3     = new Web3(url, null);
  }

  async post (message) {
    const data     = JSON.stringify(message);
    const symKeyID = this.symKeyID;
    const payload  = this.web3.utils.asciiToHex(data);
    const topic    = this.web3.utils.toHex('SLGR');

    if (this.symKeyID) {
      return this.web3.shh.post({ ...this.params, symKeyID, topic, payload });
    }
    else {
      try {
        this.symKeyID = await this.web3.shh.addSymKey(this.symKey);
        this.post(message);
      } catch(e) {
        return Promise.reject(e)
      }
    }
  }
}

export default ShhRpc;

