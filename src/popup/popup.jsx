import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'lib/store'

import NewAccountView from './new_account_view'
import './popup.css'

ReactDOM.render(
  <Provider store={store}>
    <NewAccountView/>
  </Provider>,
  document.body.appendChild(document.createElement('div')));
