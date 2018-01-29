import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import '../../semantic/dist/semantic.min.css'
import LoginForm from './loginForm'
import Workspace from './workspace'

import '../css/style.css'


export default class App extends Component {
  render() {
    if (!window.sessionStorage.getItem('jwtToken')) {
      return (
        <LoginForm />
      )
    } else {
      return (
        <Workspace />
      )
    }
  }
}

render((<BrowserRouter><App /></BrowserRouter>), document.getElementById('app'))
