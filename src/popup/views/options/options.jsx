import React          from 'react'
import { connect }    from 'react-redux'
import { connection } from 'lib/storage'
import { Button }     from '@poplocker/react-ui'
import ChangePassword from './change_password'

import './options.css'

class OptionsView extends React.Component {
  constructor (props) {
    super(props);
    this.state = { mode: 'public' }
  }

  componentDidMount () {
    connection.mode.type().then(mode => this.setState({ mode }));
  }

  handleModeChange (e) {
    if (e.target.checked) {
      connection.mode.private();
      this.setState({ mode: 'private' });
    }
    else {
      connection.mode.public();
      this.setState({ mode: 'public' });
    }
  }

  handleClearAuth () {
    connection.clear();
  }

  render () {
    return (
      <div className="options-view view">
        <div className="options-group options-group-password">
          <ChangePassword/>
        </div>
        <div className="options-group options-group-connection">
          <form>
            <input className="options-mode-check"
                   name="mode"
                   type="checkbox"
                   checked={this.state.mode == 'private'}
                   onChange={this.handleModeChange.bind(this)}/>
            <label htmlFor="mode">Private mode</label>
          </form>
          <Button icon="close" onClick={this.handleClearAuth.bind(this)}>Clear Authorizations</Button>
        </div>
      </div>
    )
  }

}

export default connect()(OptionsView)
