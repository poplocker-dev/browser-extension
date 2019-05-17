import BigNumber              from 'bignumber.js'
import { createStore }        from 'redux'
import { store }              from 'lib/store'
import { reducers }           from 'lib/store/reducers'

import { enqueuePending,
         enqueueConnections } from 'lib/store/actions'

import { account,
         transaction,
         connection }         from 'lib/storage'

export async function initOrRedirect (render) {
  const [address] = await account.address();
  const pending   = await transaction.pending();
  const connRqs   = await connection.requests.get();

  // if (address && pending.length == 0)
  //   chrome.tabs.create({ 'url': process.env.POPLOCKER_WALLET_URL });

  if (address && connRqs.length > 0) {
    store.dispatch(enqueueConnections(connRqs));
  }

  else if (address && pending.length > 0)
    store.dispatch(enqueuePending(pending));

  return render(store);
}

export function initOptions (render) {
  return render(createStore(reducers, {page: 'change_password'}));
}

export const badge = {
  set info (value) {
    this.color = '#386BE1';
    this.text = `${value}`;
  },

  set rqs (value) {
    this.color = '#f48f42';
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
