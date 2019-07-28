import React from 'react'
import './circles.css'

const FancyCircles = ({ number }) => (
  <div className="fancy-circles">
    { 
      [...Array(parseInt(number)).keys()]
        .map(i => (<div key={i} className={`circ circ-${i}`}/>))
    }
  </div>
);

export default FancyCircles;
