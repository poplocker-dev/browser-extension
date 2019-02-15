import React           from 'react'
import Header          from 'ui/header'
import { connect }     from 'react-redux'
import { fetchTxInfo } from 'lib/store/actions'
import SignForm        from './sign_form'
import TxInfo          from './info'
import AccountBalance  from './balance'

import './authorize.css'

class AuthorizeView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { showAdvanced: false }
  }

  componentDidMount() {
    this.props.dispatch(fetchTxInfo(this.props.tx.current));
  }

  render () {
    return (
      <div className="view authorize-view">
        <Header caption="Your total balance"/>
        <AccountBalance/>
        <TxInfo {...this.props} />
        <SignForm/>
      </div>
    )
  }

  handleChange () {
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }
}

export default connect(({ tx }) => ({ tx }))(AuthorizeView);
