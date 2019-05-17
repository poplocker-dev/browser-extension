import React          from 'react'
import { connect }    from 'react-redux'
import Header         from 'ui/header'
import SignForm       from './sign_form'
import TxInfo         from './info'
import AccountBalance from './balance'
import Locker         from './locker'

import { getTxPricing }                           from 'lib/rpc/eth_node'
import { account }                                from 'lib/storage'
import { updatePricing, txInfoFailed, revalueTx } from 'lib/store/actions'

import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  async componentDidMount () {
    try {
      const pricing = (await getTxPricing(this.props.current)).map(i => i.result);
      const overhead = await account.address.locker() ? 53000 : 0;
      pricing.push(overhead);
      this.props.dispatch(updatePricing(pricing));
    }
    catch(e) {
      this.props.dispatch(txInfoFailed('Transaction will fail'));
    }
  }

  render () {
    return (
      <div className="view authorize-view">
        <Header small={true}>
          <AccountBalance/>
        </Header>
        <Locker/>
        <TxInfo/>
        <SignForm/>
      </div>
    )
  }
}

const mapStore = ({ tx }) => ({
  current: tx.current,
  pricing: tx.pricing
});

export default connect(mapStore)(AuthorizeView);
