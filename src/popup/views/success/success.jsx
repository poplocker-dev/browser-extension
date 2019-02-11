import React      from 'react'
import Header     from 'ui/header'
import { Button } from '@poplocker/react-ui'

import './success.css'

const SuccessView = () => (
  <div className="success-view">
    <Header/>
    <h2>Your account was successfuly generated</h2>
    <Button icon="tick" onClick={window.close}>Great!</Button>
  </div>
)

export default SuccessView
