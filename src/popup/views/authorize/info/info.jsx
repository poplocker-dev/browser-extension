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
      <span className="row-label">From:</span>
      <SenderDomain/>
    </div>
    <div className="row">
      <span className="row-label">Amount:</span>
      <Value/>
    </div>
    <div className="row">
      <span className="row-label">Fees:</span>
      <Fee/>
    </div>
    <div className="separator"/>
    <div className="row total">
      <span className="row-label">Total:</span>
      <Total/>
    </div>
  </div>
);

export default TransactionInfo;
