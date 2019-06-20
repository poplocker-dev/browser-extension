import ShhRpc      from 'lib/rpc/whisper'
import smartLocker from 'lib/smartlocker'

const keyRequests = {

  requests: [],
  smartLockerAddress: null,
  
  subscribe (smartLockerAddress) {
    this.smartLockerAddress = smartLockerAddress;
    if (smartLockerAddress)
      new ShhRpc(process.env.SHH_URL, smartLockerAddress.substr(0, 10))
        .subscribe(key => this.queue(key));
  },

  queue (key) {
    this.validate([key])
        .then(keys => {
          if (keys.length)
            this.requests = [key, ...this.requests.filter(request => request.address != key.address).slice(0, 98)];
        });
  },

  fetch () {
    return this.validate(this.requests)
               .then(keys => this.requests = keys)
  },

  validate (keys) {
    if (this.smartLockerAddress) {
      const now = Date.now();
      return Promise.all(keys.map(key => smartLocker.isAuthoriszedKey(this.smartLockerAddress, key.address)))
                    .then(authorized => keys.filter((key, index) => this.isValid(key, authorized[index], now)));
    } else
      return Promise.resolve([]);
  },

  isValid (key, authorized, now) {
    return key.smartLocker.toLowerCase() == this.smartLockerAddress.toLowerCase() &&
           !authorized &&
           key.timeStamp - 60000 < now && now < key.timeStamp + 300000;
  }
}

export default keyRequests;
