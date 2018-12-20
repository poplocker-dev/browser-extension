import React       from 'react'
import { connect } from 'react-redux'
import Preloader   from 'ui/loader'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="balance-amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

export default connect(({ balance }) => ({ balance }))(AccountBalance);
