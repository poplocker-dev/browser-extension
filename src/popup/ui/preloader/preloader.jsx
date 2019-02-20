import React from 'react'

const Preloader = (props) => {
  if (notEmpty(props.value))
    return ( props.children )
  else
    return ( <div className="preloader">...</div> )
}

const notEmpty = (val) => {
  if (val)
    return true
  else if (Object.entries(Object.assign({}, val)).length != 0)
    return true
  else
    return false
}

export default Preloader;
