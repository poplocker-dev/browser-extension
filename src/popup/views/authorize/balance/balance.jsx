import React              from 'react'
import { connect }        from 'react-redux'
import { fixedEth }       from 'lib/helpers'
import Preloader          from 'ui/loader'

import './balance.css'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ tx }) => ({
  balance: fixedEth(tx.pricing.balance)
});

export default connect(mapStore)(AccountBalance);
