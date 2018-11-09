import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'lib/store'

import Pager from './pager'
import NewAccountView from './new_account_view'
import LoadingView from './loading_view'
import SuccessView from './success_view'

import './popup.css'

ReactDOM.render(
  <Provider store={store}>
    <Pager>
      <NewAccountView/>
      <LoadingView/>
      <SuccessView/>
    </Pager>
  </Provider>,
  document.body.appendChild(document.createElement('div')));
