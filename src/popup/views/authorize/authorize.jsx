import React          from 'react'
import { connect }    from 'react-redux'
import Header         from 'ui/header'
import SignForm       from './sign_form'
import TxInfo         from './info'
import AccountBalance from './balance'
import Locker         from './locker'

import { getTxPricing }                                              from 'lib/rpc/eth_node'
import { getSmartLockerState }                                       from 'lib/rpc/locker'
import { updatePricing, updateSmartLocker, txInfoFailed, revalueTx } from 'lib/store/actions'

import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  async componentDidMount () {
    try {
      const pricing = await getTxPricing(this.props.current);
      this.props.dispatch(updatePricing(pricing.map(i => i.result)));

      const smartLockerState = await getSmartLockerState();
      this.props.dispatch(updateSmartLocker(smartLockerState.result));

      if (this.props.isLockerTransfer)
        this.props.dispatch(revalueTx(this.props.pricing.fee, this.props.pricing.balance));
    }
    catch(e) {
      console.error(e.message);
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
  pricing: tx.pricing,
  isLockerTransfer: tx.current.params.to == process.env.REGISTRAR_ADDRESS
});

export default connect(mapStore)(AuthorizeView);
