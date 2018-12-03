import { applyMiddleware, createStore } from 'redux'
import { processPending } from 'lib/store/actions'
import thunk    from 'redux-thunk'
import { tx }   from 'lib/storage'
import reducers from 'lib/store/reducers'

export const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

tx.pending.then(pending => {
  store.dispatch(processPending(pending));
});
