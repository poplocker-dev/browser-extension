import React        from 'react'
import SenderDomain from './rows/sender_domain'
import Value        from './rows/value'
import Fee          from './rows/fee'
import Total        from './rows/total'

import './info.css'

const TransactionInfo = () => (
  <div className="transaction-info">
    <div className="title">
      Confirm your transaction
    </div>
    <div className="row">
      From: <SenderDomain/>
    </div>
    <div className="row">
      Amount: <Value/>
    </div>
    <div className="row">
      Fees: <Fee/>
    </div>
    <div className="separator"/>
    <div className="row total">
      Total <Total/>
    </div>
  </div>
);

export default TransactionInfo;
