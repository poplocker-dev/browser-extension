import React          from 'react'
import { connect }    from 'react-redux'
import Header         from 'ui/header'
import { Button }     from '@poplocker/react-ui'
import ChangePassword from './change_password'
import { connection } from 'lib/storage'

import './options.css'

class OptionsView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { isConnections: false }
  }

  async componentDidMount () {
    const isConnections = await connection.authorized.size() > 0 || await connection.rejected.size() > 0;
    this.setState({ isConnections });
  }

  handleClear () {
    this.setState({ isConnections: false });
    connection.authorized.clear();
    connection.rejected.clear();
  }

  shouldBeDisabled () {
    return !this.state.isConnections;
  }

  render () {
    return (
      <div className="options-view view">
        <Header caption="Options"/>
        <div className="clear-connections">
          <h2>Clear previously authorized websites:</h2>
          <Button icon="close" onClick={this.handleClear.bind(this)} disabled={this.shouldBeDisabled()}>Clear All</Button>
        </div>
        <ChangePassword/>
      </div>
    )
  }
}

export default connect()(OptionsView)
