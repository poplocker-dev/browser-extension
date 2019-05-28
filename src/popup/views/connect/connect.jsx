import React               from 'react'
import { connect }         from 'react-redux'
import { approve, reject } from 'lib/rpc/connection'
import { Button }          from '@poplocker/react-ui'
// import Favicon from './favicon'

import './connect.css'

class ConnectView extends React.Component  {
  render () {
    return (
      <div className="view connect">
        <div className="connect_favicon">
          {/* <Favicon url={this.props.request}/> */}
        </div>
        <p className="connect_hostname">
          { this.props.request }
        </p>
        <p className="connect_caption">
          Wants to connect with your account
        </p>
        <div className="buttons buttons--2row">
          <Button icon="tick"
                  onClick={() => approve(this.props.request)}>
            Connect
          </Button>
          <Button kind="reject"
                  icon="close"
                  onClick={() => reject(this.props.request)}>
            Reject
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(({ connections }) => ({ request: connections[0] }))(ConnectView);
