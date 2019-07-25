import React     from 'react'
import logo      from 'assets/logo.svg'
import logoSmall from 'assets/logo-small.svg'

import './header.css'

const headerContent = ({ small, children, caption }) => {
  if (small) {
    return (
      <div className="content">
        { children }
      </div>
    )
  } else {
    return (
      <div className="caption">
        { caption }
      </div>
    )
  }
}

const Header = (props) => (
  <div className={`header ${props.small ? 'header--small' : ''}`}>
    <img className="logo" alt="PopLocker logo" src={props.small ? logoSmall : logo} />
    { headerContent(props) }
  </div>
)

export default Header;
