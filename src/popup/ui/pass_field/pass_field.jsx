import React from 'react'
import cl    from 'classnames'
import Input from 'ui/input'
import './pass_field.css'

export default class PassField extends React.Component {
  constructor (props) {
    super(props);
    this.state = { show: false, type: 'password' };
  }

  previewClasses () {
    return {
      'preview': true,
      'preview--hidden': !this.state.show,
      'preview--visible': this.state.show
    }
  }

  toggle () {
    this.setState({ show: !this.state.show, }, () => {
      this.setState({ type: this.state.show ? 'text' : 'password' });
    });
  }

  render () {
    return (
      <div className="password-field">
        <Input type={this.state.type} {...this.props}/>
        <div onClick={ this.toggle.bind(this) } className={ cl(this.previewClasses()) } />
      </div>
    )
  }
}
