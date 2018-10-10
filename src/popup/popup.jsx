import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'

import { store, history } from 'lib/store'
import NewAccountView from './new_account_view'
import './popup.css'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route exact path='/' component={NewAccountView} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.body.appendChild(document.createElement('div')))
