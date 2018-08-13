import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Popup, List } from 'semantic-ui-react';
import Account from '../account/account';


class AppOptions extends Component {
  static propTypes = {
    setUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleLogout = () => {
    this.props.setUser({}, false);
  }

  render() {
    return (
      <Popup
        size="large"
        className="setting-popup"
        inverted
        trigger={
          <Menu.Item className="setting-nav no-border-radius">
            <Icon link size="large" name="setting" />
          </Menu.Item>
        }
        on="click"
        position="right center"
        content={
          <List>
            <Account />
            <List.Item
              icon="announcement"
              content="Feedback"
              className="pointer"
            />
            <List.Item
              icon="log out"
              onClick={this.handleLogout}
              content="Sign out"
              className="pointer"
            />
          </List>
        }
      />
    );
  }
}

export default AppOptions;
