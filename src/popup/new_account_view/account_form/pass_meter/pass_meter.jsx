import React from 'react'
import * as z from 'zxcvbn'
import * as cl from 'classnames'
import './pass_meter.css'

const score = (input) => {
  return z(input).score;
}

const strength = (input) => {
  switch(score(input)) {
    case 0:
      return 'Risky!'
    case 1:
      return 'Weak'
    case 2:
      return 'Medium'
    case 3:
      return 'Good Enough'
    case 4:
      return 'Strong'
  }
}

const classes = (input, type) => ({
  [type]: true,
  [`${type}-${score(input)}`]: input
});

const status = (input) => {
  if (input) {
    return (
      <div className="status">
        <span className="label">Password Strength: </span>
        <span className={ cl(classes(input, 'status')) }>{ strength(input) }</span>
      </div>
    )
  }
}

const PassMeter = ({ measure }) => (
  <div className="password-meter">
    <div className="bar">
      <div className={ cl(classes(measure, 'progress')) } />
    </div>
    { status(measure) }
  </div>
)

export default PassMeter;
