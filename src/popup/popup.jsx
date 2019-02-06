import React              from 'react'
import ReactDOM           from 'react-dom'
import { Provider }       from 'react-redux'
import { initOrRedirect } from 'lib/helpers'
import Pager              from './pager'

import './popup.css'

initOrRedirect(store => {
  ReactDOM.render(
    <Provider store={store}>
      <Pager/>
    </Provider>,
    document.body.appendChild(document.createElement('div')));
});

