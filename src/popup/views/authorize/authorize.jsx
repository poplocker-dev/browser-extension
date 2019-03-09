import React       from 'react'
import { connect } from 'react-redux'
import { ethRpc }  from 'lib/rpc'
import SignForm    from './sign_form'
import TxInfo      from './info'
import Header      from './header'

import { updatePricing, updateBlockNonce, txInfoFailed } from 'lib/store/actions'
import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  async componentDidMount () {
    try {
      const pricing    = await ethRpc.getTxPricing(this.props.current);
      const blockNonce = await ethRpc.getLatestNonce();

      this.props.dispatch(updatePricing(pricing.map(i => i.result)));
      this.props.dispatch(updateBlockNonce(blockNonce.result));
    }
    catch(e) {
      console.error(e.message);
      this.props.dispatch(txInfoFailed('Transaction will fail.'));
    }
  }

  render () {
    return (
      <div className="view authorize-view">
        <Header/>
        <TxInfo/>
        <SignForm/>
      </div>
    )
  }
}

export default connect(({ tx }) =>  ({ current: tx.current }))(AuthorizeView);
