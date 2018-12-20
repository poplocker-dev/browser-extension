import React          from 'react'
import Header         from 'ui/header'
import TxSignForm     from './tx_sign_form'
import TxInfo         from './tx_info'
import AccountBalance from './account_balance'
import GasPrice       from './gas_price'

const AuthorizeView = () => (
  <div className="view authorize-view">
    <Header caption="Your total balance"/>
    <TxInfo>
      <GasPrice/>
      <AccountBalance/>
      <TxSignForm/>
    </TxInfo>
  </div>
);

export default AuthorizeView;
