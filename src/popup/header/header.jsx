import React from 'react'
import logo from 'assets/logo.png'
import './header.css'

const Header = ({ caption }) => (
  <div className="header">
    <img className="header__logo" alt="PopLocker logo" src={logo} />
    <div className="header__caption">
      { caption }
    </div>
  </div>
)

export default Header;
