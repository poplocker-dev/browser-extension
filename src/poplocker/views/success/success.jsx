import React      from 'react'
import Header     from 'ui/header'
import { Button } from '@poplocker/react-ui'

import './success.css'

const SuccessView = () => (
  <div className="success-view view">
    <Header/>
    <h2>Your account was successfully created</h2>
    <Button icon="tick" onClick={window.close} autoFocus={true}>Close</Button>
  </div>
)

export default SuccessView
