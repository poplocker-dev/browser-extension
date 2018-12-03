import React from 'react'
import Header from 'ui/header'
import TxSignForm from './tx_sign_form'

const AuthorizeView = () => (
  <div className="view authorize-view">
    <Header caption="Your total balance"/>
    <TxSignForm/>
  </div>
);

export default AuthorizeView;
