import BigNumber                from 'bignumber.js'
import { store }                from 'lib/store'
import { enqueuePending }       from 'lib/store/actions'
import { account, transaction } from 'lib/storage'

export async function initOrRedirect (render) {
  const deviceAddress = await account.deviceAddress();
  const pending       = await transaction.pending();

  if (deviceAddress && pending.length == 0)
    chrome.tabs.create({ 'url': process.env.POPLOCKER_WALLET_URL });
  else if (deviceAddress && pending.length > 0)
    store.dispatch(enqueuePending(pending));

  return render(store);
}

export const badge = {
  set info (value) {
    this.color = '#386BE1';
    this.text = `${value}`;
  },

  set text(text) {
    chrome.browserAction.setBadgeText({ text });
  },

  set color(value) {
    chrome.browserAction.setBadgeBackgroundColor({ color: value });
  },

  reset () {
    this.text = '';
  },

  warning () {
    this.color = '#FF0054';
    this.text  = '!';
  }
}

export function fixedEth (bn) {
  return BigNumber(bn.toString(10)).dividedBy('1e13')
           .integerValue(BigNumber.ROUND_CEIL)
           .dividedBy('1e5').toFixed();
}

export function toHex (bignumber) {
  return '0x' + bignumber.toString(16);
}
