import React              from 'react'
import { connect }        from 'react-redux'
import { LockerButton }   from '@poplocker/react-ui'
import { lockerRedirect } from 'lib/helpers'

class Locker extends React.Component {
  render () {
    return (
      <div className="locker-wrapper">
        <LockerButton locker={this.state}
                      onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }

  handleClick () {
    lockerRedirect();
  }
}

export default connect(({ locker }) => ({ locker }))(Locker);
