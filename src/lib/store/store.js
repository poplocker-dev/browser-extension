import { applyMiddleware, createStore } from 'redux'
import { processPending } from 'lib/store/actions'
import thunk    from 'redux-thunk'
import { load } from 'lib/storage'
import reducers from 'lib/store/reducers'

export const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

load('pending').then(pending => {
  store.dispatch(processPending(pending));
});
