import React           from 'react'
import Header          from 'ui/header'
import { connect }     from 'react-redux'
import { fetchTxInfo } from 'lib/store/actions'
import SignForm        from './sign_form'
import TxInfo          from './info'
import AccountBalance  from './balance'

import './authorize.css'

class AuthorizeView extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchTxInfo(this.props.current));
  }

  render () {
    return (
      <div className="view authorize-view">
        <Header caption="Your total balance"/>
        <AccountBalance/>
        <TxInfo/>
        <SignForm/>
      </div>
    )
  }
}

const mapStore = ({ transaction }) => ({
  current: transaction.pending.current
});

export default connect(mapStore)(AuthorizeView);
