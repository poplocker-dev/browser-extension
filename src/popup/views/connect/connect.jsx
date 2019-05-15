import React               from 'react'
import { connect }         from 'react-redux'
import { approve, reject } from 'lib/rpc/connection'
import { Button }          from '@poplocker/react-ui'
import Favicon from './favicon'

class ConnectView extends React.Component  {
  render () {
    return (
      <div className="view connect-view">
        <Favicon url={this.props.request}/>
        <Button icon="tick"
                onClick={() => approve(request)}>
          Connect
        </Button>
        <Button kind="reject"
                icon="close"
                onClick={() => reject(request)}>
          Reject
        </Button>
      </div>
    )
  }
}

export default connect(({ connections }) => ({ request: connections[0] }))(ConnectView);
