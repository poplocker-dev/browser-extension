import Web3 from 'web3'

class ShhRpc {
  constructor (url, topic) {
    this.params = {
      ttl: 300,
      priority: 1,
      powTarget: 2.01,
      powTime: 100
    }
    this.url      = url;
    this.topic    = topic;
    this.web3     = new Web3(url, null);
    this.symKeyID = null;
  }

  async post (message) {
    const symKeyID = this.symKeyID;
    const topic    = this.web3.utils.toHex(this.topic);
    const data     = JSON.stringify(message);
    const payload  = this.web3.utils.utf8ToHex(data);

    try {
      if (symKeyID && await this.web3.shh.hasSymKey(symKeyID)) {
        return this.web3.shh.post({ ...this.params, symKeyID, topic, payload });
      } else {
        this.web3 = new Web3(this.url, null);
        this.symKeyID = await this.web3.shh.generateSymKeyFromPassword(this.topic);
        this.post(message);
      }
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async subscribe(callback) {
    const topics = [this.web3.utils.toHex(this.topic)];

    try {
      const symKeyID = await this.web3.shh.generateSymKeyFromPassword(this.topic);
      this.web3.shh.subscribe('messages', { symKeyID, topics }, (error, result) => {
        if (error) return Promise.reject(error);
        callback(JSON.parse(this.web3.utils.hexToUtf8(result.payload)));
      })
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

export default ShhRpc;
