import React, { Component } from 'react';
import axios from 'axios';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { routes, options } from './api';
import Auth from './auth/auth';
import Workspace from './workspace/workspace';
import { UserContext } from './auth/userContext';
import './css/ease.css';
import './css/colors.css';
import './css/styles.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: {},
      loggedIn: false,
      setUser: this.setUser,
    };
  }

  async componentWillMount() {
    try {
      const user = (await axios.get(routes.currentUser, options())).data;
      this.setState({ user, loggedIn: true, loaded: true });
    } catch (error) {
      this.setState({ loggedIn: false, loaded: true });
    }
  }

  setUser = async (user, loggedIn) => {
    if (!loggedIn) {
      await this.logOut();
      window.localStorage.removeItem('jwtToken');
    }
    this.setState({ user, loggedIn });
  }

  logOut = async () => (axios.post(routes.logout, {}, options()));

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
