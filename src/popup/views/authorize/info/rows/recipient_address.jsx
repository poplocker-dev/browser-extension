import React       from 'react'
import Preloader   from 'ui/loader'

import './recipient_address.css'

const RecipientAddress = ({ transaction }) => (
  <div className="row recipient-address">
    <span className="row-label">To:</span>
    <Preloader value={ transaction.pending.current }>
      <div className="amount recipient-address-value">{ address(transaction) }</div>
    </Preloader>
  </div>
);

const address = (transaction) => {
  return transaction.pending.current.params.to || 'N/A';
}

export default RecipientAddress;
