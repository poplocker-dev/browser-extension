import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'lib/store'

import Pager from './pager'
import NewAccountView from './views/new_account'
import LoadingView from './views/loading'
import SuccessView from './views/success'
import FancyCircles from 'ui/circles'
import AuthoriseView from './views/authorise'

import './popup.css'

ReactDOM.render(
  <Provider store={store}>
    <>
      <FancyCircles number="8"/>
      <Pager>
        <NewAccountView/>
        <LoadingView/>
        <SuccessView/>
        <AuthoriseView/>
      </Pager>
    </>
  </Provider>,
  document.body.appendChild(document.createElement('div')));
