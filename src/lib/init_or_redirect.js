import { store }                from 'lib/store'
import { enqueuePending }       from 'lib/store/actions'
import { account, transaction } from 'lib/storage'

export default async function initOrRedirect (render) {
  const [address] = await account.address();
  const pending   = await transaction.pending();

  if (address && pending.length == 0)
    chrome.tabs.create({ 'url': process.env.POPLOCKER_WALLET_URL });
  else if (pending.length > 0)
    store.dispatch(enqueuePending(pending));
  return render(store);
}
