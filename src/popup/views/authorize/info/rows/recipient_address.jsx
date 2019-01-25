import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'

import './recipient_address.css'

const RecipientAddress = ({ recipientAddress }) => (
  <div className="recipient-address">
    <Preloader value={ recipientAddress }>
      <div className="amount recipient-address-value">{ recipientAddress }</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  recipientAddress: transaction.pending.current.params.to || 'N/A'
});

export default connect(mapStore)(RecipientAddress);
