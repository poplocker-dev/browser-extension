import React from 'react'
import './pass_field.css'

const PassField = (props) => (
  <div className="password-field">
    <div className="password-field__label">
      { props.label }
    </div>
    <input type="password" {...props} />
    <div className="error">{props.error}</div>
  </div>
)

export default PassField;
