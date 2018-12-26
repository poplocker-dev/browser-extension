import React       from 'react'
import { connect } from 'react-redux'
import unit        from 'ethjs-unit'
import Preloader   from 'ui/loader'

const AccountBalance = ({ balance }) => (
  <div className="account-balance">
    <Preloader value={ balance }>
      <div className="balance-amount">{ balance } ETH</div>
    </Preloader>
  </div>
);

const mapStore = (store) => ({
  balance: unit.fromWei(store.balance, 'ether')
});

export default connect(mapStore)(AccountBalance);
