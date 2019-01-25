import React            from 'react'
import SenderDomain     from './rows/sender_domain'
import RecipientAddress from './rows/recipient_address'
import Value            from './rows/value'
import Fee              from './rows/fee'
import GasPrice         from './rows/gas_price'
import Total            from './rows/total'

import './info.css'

const TransactionInfo = (props) => (
  <div className="transaction-info">
    <div className="title">
      Confirm your transaction
    </div>
    {
      props.showAdvanced? (
        <div className="row">
          To: <RecipientAddress/>
        </div>
      ) : (
        <div className="row">
          From: <SenderDomain/>
        </div>
      )
    }
    <div className="row">
      Amount: <Value/>
    </div>
    <div className="row">
      Fees: <Fee/>
    </div>
    <GasPrice showAdvanced={ props.showAdvanced }/>
    <div className="separator"/>
    <div className="row total">
      Total <Total/>
    </div>
  </div>
);

export default TransactionInfo;
