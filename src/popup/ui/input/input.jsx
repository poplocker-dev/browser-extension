import React   from 'react'
import * as cl from 'classnames'
import './input.css'

const classes = (props) => ({
  'input-field': true,
  'input-field--invalid': props.error
});

const Input = (props) => (
  <div className={ cl(classes(props)) }>
    <div className="label">{props.label}</div>
    <input {...props}/>
    <div className="error">{props.error}</div>
  </div>
)

export default Input;
