import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'lib/store'
import { enqueuePending } from 'lib/store/actions'

import Pager from './pager'
import NewAccountView from './views/new_account'
import LoadingView from './views/loading'
import SuccessView from './views/success'
import FancyCircles from 'ui/circles'
import AuthorizeView from './views/authorize'

import './popup.css'

store.dispatch(enqueuePending());

ReactDOM.render(
  <Provider store={store}>
    <>
      <FancyCircles number="8"/>
      <Pager>
        <NewAccountView/>
        <LoadingView/>
        <SuccessView/>
        <AuthorizeView/>
      </Pager>
    </>
  </Provider>,
  document.body.appendChild(document.createElement('div')));
