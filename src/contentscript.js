const el = document.createElement('script');
const container = document.head || document.documentElement;

el.src = chrome.extension.getURL('injected.js');

el.onload = function() {
  this.remove();
};
container.insertBefore(el, container.children[0]);
