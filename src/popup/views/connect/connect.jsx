import React               from 'react'
import { connect }         from 'react-redux'
import { approve, reject } from 'lib/rpc/connection'
import { Button }          from '@poplocker/react-ui'

class ConnectView extends React.Component {
  render () {
    return (
      <div className="view connect-view">
        <Button icon="tick" onClick={() => approve(this.props.request)}>Connect</Button>
        <Button icon="reject" onClick={() => reject(this.props.request)}>Reject</Button>
      </div>
    )
  }
}

export default connect(({ connections }) => ({ request: connections[0] }))(ConnectView);
