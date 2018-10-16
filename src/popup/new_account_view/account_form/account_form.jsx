import React from 'react'
import { connect } from 'react-redux'
import { newAccount } from 'lib/store/actions'

class AccountForm extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const val = this.inputRef.current.value;
    this.inputRef.current.value = '';
    this.props.dispatch(newAccount(val));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" ref={this.inputRef} value={this.inputRef.value} />
        <button>Create</button>
      </form>
    )
  }
}

export default connect()(AccountForm)
