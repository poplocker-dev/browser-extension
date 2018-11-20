import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'lib/store'

import Pager from './pager'
import NewAccountView from './views/new_account'
import LoadingView from './views/loading'
import SuccessView from './views/success'

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
