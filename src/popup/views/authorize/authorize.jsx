import React             from 'react'
import { connect }       from 'react-redux'
import { ethRpc }        from 'lib/rpc'
import { updatePricing } from 'lib/store/actions'
import Header            from 'ui/header'
import SignForm          from './sign_form'
import TxInfo            from './info'
import AccountBalance    from './balance'

import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  async componentDidMount() {
    const results = await ethRpc.getTxPricing(this.props.current);
    this.props.dispatch(updatePricing(results.map(i => i.result)));
  }

  render () {
    return (
      <div className="view authorize-view">
        <Header caption="Your total balance"/>
        <AccountBalance/>
        <TxInfo/>
        {/* <SignForm/> */}
      </div>
    )
  }
}

export default connect(({ tx }) =>  ({ current: tx.current }))(AuthorizeView);
