import React          from 'react'
import logo           from 'assets/logo.svg'
import AccountBalance from './balance'

import './header.css'

const Header = () => (
  <div className="header">
    <img className="logo" alt="PopLocker logo" src={logo} />
    <AccountBalance/>
    <div/>
  </div>
)

export default Header;
