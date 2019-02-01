import React from 'react'

import './range.css'

const Range = (props) => (
  <div className="range">
    <div className="label">
      { `${props.label}:` }
    </div>
    <input type="range"
           min="1"
           max="100"
           step="1"
           {...props} />
    <div className="from-to">
      <span className="from">{ props.from }</span>
      <span className="to">{ props.to }</span>
    </div>
  </div>
)

export default Range;
