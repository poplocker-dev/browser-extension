import { delegateTo, Proxy } from 'lib/messaging'

dirtyInjectProvider();

const proxy = new Proxy('ETH_RX', 'ETH_TX');
proxy.handle(handleBackground);

function dirtyInjectProvider () {
  const el = document.createElement('script');
  const container = document.head || document.documentElement;

  el.src = chrome.extension.getURL('injected.js');

  el.onload = function() {
    this.remove();
  };

  container.insertBefore(el, container.children[0]);
}

function handleBackground (payload) {
  return delegateTo.background(payload)
    .then(response => proxy.send(response))
}
