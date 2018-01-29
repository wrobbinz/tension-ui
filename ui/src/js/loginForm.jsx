import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      username: '',

    }
  }


  async logIn(event) {
    try {
      const apiBaseUrl = 'http://localhost:3333/api/v1/'
      const payload = {
        email: this.state.email.value,
        password: this.state.password.value,
      }
      const res = await axios.post(`${apiBaseUrl}login/`, payload)
      window.sessionStorage.setItem('jwtToken', res.data.token)
      console.log('Login successful', res)
    } catch (err) {
      console.log(err)
    }
  }
  async signUp(event) {
    try {
      const apiBaseUrl = 'http://localhost:3333/api/v1/'
      const payload = {
        email: this.state.email.value,
        username: this.state.username.value,
        password: this.state.password.value,
      }
      await axios.post(`${apiBaseUrl}users/`, payload)
      this.logIn()
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="login-form">
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
          `}
        </style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              {' '}Log-in to your account
            </Header>
            <Form size="large">
              <Segment>
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                  onChange={(event, newValue) => this.setState({ email: newValue })}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="User Name"
                  onChange={(event, newValue) => this.setState({ password: newValue })}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={(event, newValue) => this.setState({ password: newValue })}
                />

                <Button onClick={event => this.logIn(event)} color="teal" fluid size="large">
                  Login
                </Button>
                <Button onClick={event => this.signUp(event)} color="blue" fluid size="large">
                  Sign Up
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <a href="#">Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default LoginForm
