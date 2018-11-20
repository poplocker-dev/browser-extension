import React from 'react'
import './button.css'

const Button = (props) => (
  <button className="btn" {...props}>
    <div className="caption">
      { props.children }
    </div>
    <div className={`icon icon--${props.icon}`}></div>
  </button>
);

export default Button;
