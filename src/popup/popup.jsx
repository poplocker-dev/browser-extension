import React              from 'react'
import ReactDOM           from 'react-dom'
import { Provider }       from 'react-redux'
import { initOrRedirect } from 'lib/helpers'
import FancyCircles       from 'ui/circles'
import Pager              from './pager'
import NewAccountView     from './views/new_account'
import LoadingView        from './views/loading'
import SuccessView        from './views/success'
import AuthorizeView      from './views/authorize'

import './popup.css'

initOrRedirect(store => {
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
});

