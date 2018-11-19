import React from 'react'
import cl from 'classnames'
import './pass_field.css'

export default class PassField extends React.Component {
  constructor (props) {
    super(props);
    this.state = { show: false, type: 'password' };
  }

  fieldClasses () {
    return {
      'password-field': true,
      'password-field--invalid': this.props.error
    }
  }

  previewClasses () {
    return {
      'preview': true,
      'preview--hidden': !this.state.show,
      'preview--visible': this.state.show
    }
  }

  toggle () {
    this.setState({ show: !this.state.show, type: this.state.show ? 'text' : 'password' });
  }

  render () {
    return (
      <div className={ cl(this.fieldClasses()) }>
        <div className="label">{this.props.label}</div>
        <input type={this.state.type} {...this.props}/>
        <div onClick={ this.toggle.bind(this) } className={ cl(this.previewClasses()) } />
        <div className="error">{this.props.error}</div>
      </div>
    )
  }
}
