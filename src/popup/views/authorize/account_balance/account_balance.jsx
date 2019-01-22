import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

import './account_balance.css'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ transaction }) => ({
  balance: unit.fromWei(transaction.pricing.balance, 'ether')
});

export default connect(mapStore)(AccountBalance);
