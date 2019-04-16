import React              from 'react'
import { connect }        from 'react-redux'
import { LockerButton }   from '@poplocker/react-ui'
import { lockerRedirect } from 'lib/helpers'

class Locker extends React.Component {
  render () {
    return (
      <LockerButton locker={this.props.locker}
                    onClick={this.handleClick.bind(this)}/>
    )
  }

  handleClick () {
    lockerRedirect();
  }
}

export default connect(({ locker }) => ({ locker }))(Locker);
