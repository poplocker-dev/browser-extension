import React from 'react'
import cl from 'classnames'
import './pass_field.css'

const classes = (props) => ({
  'password-field': true,
  'password-field--invalid': props.error
});

const PassField = (props) => (
  <div className={cl(classes(props))}>
    <div className="password-field__label">
      { props.label }
    </div>
    <input type="password" {...props} />
    <div className="password-field__error">{ props.error }</div>
  </div>
)

export default PassField;
