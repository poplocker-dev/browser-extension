import React          from 'react'
import { connect }    from 'react-redux'
import Header         from 'ui/header'
import SignForm       from './sign_form'
import TxInfo         from './info'
import AccountBalance from './balance'

import { getBalance, getTxPricing }                   from 'lib/rpc/eth_node'
import { updateBalance, updatePricing, txInfoFailed } from 'lib/store/actions'

import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  async componentDidMount () {
    try {
      const balance = await getBalance();
      this.props.dispatch(updateBalance(balance.result));
      const pricing = await getTxPricing(this.props.current);
      this.props.dispatch(updatePricing(pricing.map(i => i.result)));
    }
    catch(e) {
      this.props.dispatch(txInfoFailed('Transaction will fail'));
    }
  }

  render () {
    return (
      <div className="authorize-view view">
        <Header small={true}>
          <AccountBalance/>
        </Header>
        <TxInfo/>
        <SignForm/>
      </div>
    )
  }
}

export default connect(({ tx }) =>  ({ current: tx.current }))(AuthorizeView);
