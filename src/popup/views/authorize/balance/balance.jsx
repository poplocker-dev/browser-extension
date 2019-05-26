import React         from 'react'
import { connect }   from 'react-redux'
import { fixedEth }  from 'lib/helpers'
import { Preloader } from '@poplocker/react-ui'

import './balance.css'

const Balance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

const mapStore = ({ tx }) => ({
  balance: tx.balance && fixedEth(tx.balance)
});

export default connect(mapStore)(Balance);
