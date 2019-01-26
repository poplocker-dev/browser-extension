import React        from 'react'
import { connect }  from 'react-redux'
import SenderDomain from './rows/sender_domain'
import Value        from './rows/value'
import Fee          from './rows/fee'
import Total        from './rows/total'

import './info.css'

const TransactionInfo = (tx) => (
  <div className="transaction-info">

    <div className="title">
      Confirm your transaction
    </div>

    <SenderDomain {...tx}/>
    <Value {...tx}/>
    <Fee {...tx}/>
    <div className="separator"/>
    <Total {...tx}/>

  </div>
);

export default connect(({ transaction }) => ({ transaction }))(TransactionInfo);
