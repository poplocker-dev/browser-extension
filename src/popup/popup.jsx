import React              from 'react'
import ReactDOM           from 'react-dom'
import { Provider }       from 'react-redux'
import { initOrRedirect } from 'lib/helpers'
import FancyCircles       from 'ui/circles'      
import Pager              from './pager'

import './popup.css'

initOrRedirect(store => {
  ReactDOM.render(
    <Provider store={store}>
      <>
        <FancyCircles number="8"/>
        <Pager/>
      </>
    </Provider>,
    document.body.appendChild(document.createElement('div')));
});
