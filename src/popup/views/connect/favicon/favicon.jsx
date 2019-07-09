import React    from 'react'
import jazzicon from 'jazzicon'

import './favicon.css'

class Favicon extends React.Component  {
  constructor (props) {
    super(props);
    this.state   = { placeholder: true };
    this.iconRef = React.createRef();
    this.imgRef  = React.createRef();
  }

  generateIcon () {
    const icon = jazzicon(100, this.props.url);
    this.iconRef.current.appendChild(icon);
    this.iconRef.current.classList.remove('favicon--hidden')
  }

  favicon () {
    return (
      <div className="favicon favicon--hidden" ref={this.iconRef}>
        <img alt="dapp favicon"
             ref={this.imgRef}
             className="image--hidden"
             src={this.props.url + 'favicon.ico'}
             onLoad={this.showIcon.bind(this)}
             onError={this.generateIcon.bind(this)}/>
      </div>
    )
  }

  showIcon () {
    this.imgRef.current.classList.remove('image--hidden');
  }

  render () {
    return this.favicon();
  }

}

export default Favicon;
