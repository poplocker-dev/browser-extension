import React            from 'react'
import Header           from 'ui/header'
import TxSignForm       from './tx_sign_form'
import TxPanel          from './tx_panel'
import AccountBalance   from './account_balance'

import './authorize.css'

const AuthorizeView = () => (
  <div className="view authorize-view">
    <Header caption="Your total balance"/>
    <AccountBalance/>
    <TxPanel/>
    <TxSignForm/>
  </div>
);

export default AuthorizeView;
