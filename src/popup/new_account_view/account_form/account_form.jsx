import React from 'react'
import { connect } from 'react-redux'
import { newAccount } from 'lib/store/actions'

class AccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(newAccount(this.inputRef.current.value))
    this.inputRef.current.value = ''
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label for="password">Password:</label>
        <input name="password" type="password" ref={this.inputRef} value={this.inputRef.value} />
        <button>Create</button>
      </form>
    )
  }
}

export default connect()(AccountForm)
