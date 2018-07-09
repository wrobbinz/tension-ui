import React, { Component } from 'react';
import { Menu, Icon, Popup, List } from 'semantic-ui-react';
import Account from '../account/account';
import { UserContext } from '../../auth/userContext';


class AppOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ setUser }) => (
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
                  onClick={() => setUser({}, false)}
                  content="Sign out"
                  className="pointer"
                />
              </List>
            }
          />
        )}
      </UserContext.Consumer>
    );
  }
}

export default AppOptions;
