import React from 'react'
import './button.css'

const Button = (props) => (
  <button className="btn" {...props}>{ props.children }</button>
);

export default Button;
