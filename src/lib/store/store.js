import { createMemoryHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import reducers from 'lib/store/reducers'

export const history = createMemoryHistory()
export const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(
    routerMiddleware(history)
  )
)
