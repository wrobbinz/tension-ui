import React, { Component } from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Api from './api';
import Auth from './auth/auth';
import Workspace from './workspace/workspace';
import { UserContext } from './auth/userContext';
import './css/ease.css';
import './css/colors.css';
import './css/styles.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      user: {},
      loaded: false,
      loggedIn: false,
    };
  }

  async componentWillMount() {
    try {
      const token = window.localStorage.jwtToken;
      if (!token) {
        this.setState({ loggedIn: false, loaded: true });
      } else {
        const user = (await this.api.getCurrentUser()).data;
        this.setState({ user, loggedIn: true, loaded: true });
      }
    } catch (error) {
      this.setState({ loggedIn: false, loaded: true });
    }
  }

  setUser = async (user, loggedIn) => {
    if (!loggedIn) {
      await this.api.logOut();
      window.localStorage.removeItem('jwtToken');
    }
    this.setState({ user, loggedIn });
  }

  updateUser = async (data) => {
    try {
      const user = { ...this.state.user, ...data };
      this.setState({ user });

      return this.api.updateUser({ user, data });
    } catch (error) {
      throw new Error(error);
    }
  }

  render() {
    const { loaded, loggedIn } = this.state;
    if (!loaded) {
      return (
        <Segment basic className="full-height">
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        </Segment>
      );
    }
    return loggedIn ?
      (
        <UserContext.Provider value={this.state}>
          <Workspace
            user={this.state.user}
            updateUser={this.updateUser}
            setUser={this.setUser}
            className="full-height"
          />
        </UserContext.Provider>
      ) :
      (
        <Auth
          setUser={this.setUser}
          loggedIn={loggedIn}
        />
      );
  }
}

export default App;
