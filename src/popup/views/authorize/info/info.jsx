import React            from 'react'
import { connect }      from 'react-redux'
import SenderDomain     from './rows/sender_domain'
import RecipientAddress from './rows/recipient_address'
import Value            from './rows/value'
import Fee              from './rows/fee'
import GasPrice         from './rows/gas_price'
import Total            from './rows/total'

import './info.css'

const TransactionInfo = (tx) => (
  <div className="transaction-info">

    <div className="title">
      Confirm your transaction
    </div>
    {
      tx.showAdvanced? (
        <RecipientAddress {...tx}/>
      ) : (
        <SenderDomain {...tx}/>
      )
    }
    <Value    {...tx}/>
    <Fee      {...tx}/>
    <GasPrice {...tx}/>
    <Value    {...tx}/>
    <Fee      {...tx}/>
    <div className="separator"/>
    <Total    {...tx}/>
  </div>
);

export default connect(({ transaction }) => ({ transaction }))(TransactionInfo);
