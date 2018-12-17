import React from 'react'

const Preloader = (props) => {
  if (props.value)
    return ( props.children )
  else
    return ( <div className="preloader">Loading</div> )
}

export default Preloader;
