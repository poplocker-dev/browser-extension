import React from 'react'
import Header from 'ui/header'
import TxSignForm from './tx_sign_form'
import AccountBalance from './account_balance'

const AuthorizeView = () => (
  <div className="view authorize-view">
    <Header caption="Your total balance"/>
    <AccountBalance/>
    <TxSignForm/>
  </div>
);

export default AuthorizeView;