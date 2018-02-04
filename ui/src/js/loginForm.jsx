import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'
import api from './api'


class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      username: '',
      signup: false,
      loginFailed: false,
      formColor: 'teal',
    }
  }

  async logIn() {
    try {
      const payload = {
        email: this.state.email,
        password: this.state.password,
      }
      const res = await axios.post(api.login, payload)
      window.sessionStorage.setItem('jwtToken', res.data.token)
      this.props.loggedIn(true)
      console.log('Login successful', res)
    } catch (err) {
      this.setState({
        loginFailed: true,
      })
      console.log(err)
    }
  }

  loadLogin() {
    this.setState({
      signup: false,
      formColor: 'teal',
    })
  }
  loadSignup() {
    this.setState({
      signup: true,
      formColor: 'blue',
      loginFailed: false,
      password: '',
    })
  }

  async signUp() {
    try {
      const payload = {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
      }
      console.log(payload)
      await axios.post(api.users, payload)
      this.logIn()
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="login-form full-height">
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color={this.state.formColor} textAlign="center">
              {' '}{ this.state.signup === true ? 'Sign Up' : 'Log In'}
            </Header>
            <Form size="large">
              <Segment>
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={this.state.email}
                  onChange={event => this.setState({ email: event.target.value })}
                />
                {this.state.signup ?
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="User Name"
                    value={this.state.username}
                    onChange={event => this.setState({ username: event.target.value })}
                  /> : null }
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={event => this.setState({ password: event.target.value })}
                />
                { !this.state.signup ?
                  <Button onClick={event => this.logIn(event)} color="teal" fluid size="large">
                    Login
                  </Button> :
                  <Button onClick={event => this.signUp(event)} color="blue" fluid size="large">
                    Sign Up
                  </Button>
                }
              </Segment>
            </Form>
            { this.state.loginFailed === true ?
              <Message
                error
                header="Login Failed"
                content="Email or password we're incorrect."
              /> : null
            }
            { this.state.signup === true ?
              <Message>
                Already a user? <a href="#" onClick={() => this.loadLogin()}>Log In</a>
              </Message> :
              <Message>
                New to us? <a href="#" onClick={() => this.loadSignup()}>Sign Up</a>
              </Message>
            }


          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

LoginForm.propTypes = {
  loggedIn: PropTypes.func,
}

LoginForm.defaultProps = {
  loggedIn: false,
}

export default LoginForm
