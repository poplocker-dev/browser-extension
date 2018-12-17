import React from 'react'
import unit from 'ethjs-unit'
import { connect } from 'react-redux'
import Preloader from 'ui/loader'
import { fetchBalance } from 'lib/store/actions'

class AccountBalance extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchBalance());
  }

  render () {
    return (
      <div className="account-balance">
        <Preloader value={ this.props.balance }>
          <div className="balance-amount">{ this.props.balance }</div>
        </Preloader>
      </div>
    )
  }
}

const mapStore = (store) => ({
  balance: unit.fromWei(store.balance, 'ether')
});

export default connect(mapStore)(AccountBalance);
