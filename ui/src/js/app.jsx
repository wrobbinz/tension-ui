import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import '../../semantic/dist/semantic.min.css'
import '../css/style.css'
import LoginForm from './loginForm'
import Workspace from './workspace'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
    this.setLoginState = this.setLoginState.bind(this)
  }

  setLoginState(value) {
    this.setState({
      loggedIn: value,
    })
  }

  render() {
    if (this.state.loggedIn === true || window.sessionStorage.getItem('jwtToken')) {
      return (
        <Workspace className="full-height" />
      )
    } else {
      return (
        <LoginForm
          loggedIn={this.setLoginState}
        />
      )
    }
  }
}

render((<BrowserRouter><App /></BrowserRouter>), document.getElementById('app'))
