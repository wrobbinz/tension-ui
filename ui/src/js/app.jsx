import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import api from './api'
import '../../semantic/dist/semantic.min.css'
import '../css/style.css'
import LoginForm from './loginForm'
import WorkSpace from './workSpace'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
    this.setLoginState = this.setLoginState.bind(this)
  }

  setLoginState(value) {
    this.setState({ loggedIn: value })
  }

  render() {
    if (this.state.loggedIn === true || window.localStorage.getItem('jwtToken')) {
      return (
        <WorkSpace
          className="full-height"
          user={this.state.user}
          loggedIn={this.setLoginState}
        />
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
