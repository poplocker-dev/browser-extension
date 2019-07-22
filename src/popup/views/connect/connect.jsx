import React                       from 'react'
import { connect }                 from 'react-redux'
import Header                      from 'ui/header'
import { authorizeCnx, rejectCnx } from 'lib/rpc/connection'
import { Button }                  from '@poplocker/react-ui'

import './connect.css'

class ConnectView extends React.Component  {
  handleReject () {
    rejectCnx(this.props.request).then(window.close);
  }

  handleAuthorize () {
    authorizeCnx(this.props.request).then(window.close);
  }

  render () {
    return (
      <div className="connect-view">
        <Header/>
        <h1>{this.props.request}</h1>
        <h2>Would like to connect to your account</h2>
        <h2>Only authorize if you trust this site</h2>
        <div className="buttons buttons--2row">
          <Button tabIndex={-1}
                  kind="reject"
                  icon="close"
                  onClick={this.handleReject.bind(this)}>
            Reject
          </Button>
          <Button tabIndex={-1}
                  icon="tick"
                  onClick={this.handleAuthorize.bind(this)}>
            Authorize
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(({ pendingCnxs }) => ({ request: pendingCnxs[0] }))(ConnectView);
