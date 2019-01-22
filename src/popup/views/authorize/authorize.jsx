import React            from 'react'
import Header           from 'ui/header'
import { connect }      from 'react-redux'
import { fetchTxInfo }  from 'lib/store/actions'
import TxSignForm       from './tx_sign_form'
import TxPanel          from './tx_panel'
import AccountBalance   from './account_balance'

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
        <TxPanel/>
        <TxSignForm/>
      </div>
    )
  }
}

const mapStore = ({ transaction }) => ({
  current: transaction.pending.current
});

export default connect(mapStore)(AuthorizeView);
