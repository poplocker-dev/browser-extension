import React            from 'react'
import Header           from 'ui/header'
import TxSignForm       from './tx_sign_form'
import TxInfo           from './tx_info'
import AccountBalance   from './account_balance'
import TransactionValue from './transaction_value'
import GasPrice         from './gas_price'
import GasEstimate      from './gas_estimate'
import TransactionFee   from './transaction_fee'
import RecipientAddress from './recipient_address'
import RecipientDomain  from './recipient_domain'

const AuthorizeView = () => (
  <div className="view authorize-view">
    <Header caption="Your total balance"/>
    <TxInfo>
      <AccountBalance/>
      <TransactionValue/>
      <GasPrice/>
      <GasEstimate/>
      <TransactionFee/>
      <RecipientDomain/>
      <RecipientAddress/>
      <TxSignForm/>
    </TxInfo>
  </div>
);

export default AuthorizeView;
