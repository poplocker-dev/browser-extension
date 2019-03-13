import React  from 'react'
import logo   from 'assets/logo.svg'
import Locker from './locker'

import './header.css'

const Header = ({ caption }) => (
  <div className="header">
    <img className="logo" alt="PopLocker logo" src={logo} />
    <div className="caption">
      { caption }
    </div>
    <Locker/>
  </div>
)

export default Header;
