import big                      from 'bn.js'
import unit                      from 'ethjs-unit'
import { store }                from 'lib/store'
import { enqueuePending }       from 'lib/store/actions'
import { account, transaction } from 'lib/storage'

export async function initOrRedirect (render) {
  const [address] = await account.address();
  const pending   = await transaction.pending();

  if (address && pending.length == 0)
    chrome.tabs.create({ 'url': process.env.POPLOCKER_WALLET_URL });
  else if (address && pending.length > 0)
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

export function fixedEth (bigNumber) {
  const factor  = new big(1e13);
  const rounded = bigNumber.divRound(factor).mul(factor);

  return unit.fromWei(rounded, 'ether');
}

export function toHex (bignumber) {
  return '0x' + bignumber.toString(16);
}
