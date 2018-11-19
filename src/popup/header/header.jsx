import React from 'react'
import logo from 'assets/logo.png'
import './header.css'

const Header = ({ caption }) => (
  <div className="header">
    <img className="logo" alt="PopLocker logo" src={logo} />
    <div className="caption">
      { caption }
    </div>
  </div>
)

export default Header;
