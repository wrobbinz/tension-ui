import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import axios from 'axios';
import api from '../api';


class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      signup: false,
      loginFailed: false,
      formColor: 'teal',
    };
  }

  async logIn() {
    try {
      const { email, password } = this.state;
      const jwtToken = (await axios.post(api.login, { email, password })).data;
      window.localStorage.setItem('jwtToken', jwtToken);
      this.props.setLoginStatus(true);
    } catch (error) {
      this.setState({
        loginFailed: true,
      });
      console.error(`[auth.logIn] ${error}`);
    }
  }

  loadLogin() {
    this.setState({
      signup: false,
      formColor: 'teal',
    });
  }

  loadSignup() {
    this.setState({
      signup: true,
      formColor: 'blue',
      loginFailed: false,
      password: '',
    });
  }

  async signUp() {
    try {
      const { email, username, password } = this.state;
      await axios.post('http://0.0.0.0:4000/api/v1/users', { email, username, password });
      await this.logIn();
    } catch (error) {
      console.error('[auth.signUp]', error);
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
              {' '}{ this.state.signup ? 'Sign Up' : 'Log In'}
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
            { this.state.loginFailed ?
              <Message
                error
                header="Login Failed"
                content="Email or password we're incorrect."
              /> : null
            }
            {
              <Message>
                {
                  this.state.signup ? 'Already a user? ' : 'New to us? '
                }
                { this.state.signup ? (
                  <a href="#" onClick={() => this.loadLogin()}>Log In</a>
                  ) : (
                    <a href="#" onClick={() => this.loadSignup()}>Sign Up</a>
                  )
                }
              </Message>
            }
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Auth.propTypes = {
  setLoginStatus: PropTypes.func,
};

Auth.defaultProps = {
  setLoginStatus: null,
};

export default Auth;
