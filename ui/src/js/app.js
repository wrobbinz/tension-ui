import React, { Component } from 'react'
import { render } from 'react-dom'
// import '../css/style.css'
import '../scss/style.scss'
import testImage from '../assets/wrobbinz.jpg'


export default class Hello extends Component {
  render() {
    return (
      <div>
        Bam!
        <br/>
        <img src={testImage} alt="wrobbinz" />
      </div>
    )
  }
}

render(<Hello />, document.getElementById('app'))
