export function sendToBackground (message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (response) resolve(response);
      else reject();
    });
  })
}