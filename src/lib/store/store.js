import { applyMiddleware, createStore } from 'redux'
import { reducers }                     from 'lib/store/reducers'
import thunk                            from 'redux-thunk'

export const store = createStore(
  reducers,
  applyMiddleware(thunk)
);


