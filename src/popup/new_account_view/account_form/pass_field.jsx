import React from 'react'

const PassField = (props) => (
  <div className="password-field">
    <input type="password" {...props} />
    <div className="error">{ props.error }</div>
  </div>
)

export default PassField;
