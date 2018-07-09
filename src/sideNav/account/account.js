import React, { Component } from 'react';
import { List, Icon, Modal, Header, Button } from 'semantic-ui-react';
import './account.css';


class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={
          <List.Item
            icon="options"
            content="Settings"
            className="pointer"
          />
        }
        basic
        size="small"
      >
        <Header
          icon="settings"
          content="User Settings"
        />
        <Modal.Content>
          <p>Are you sure you want to delete this note? (This action cannot be undone)</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="grey" inverted>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" inverted>
            <Icon name="check" /> Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Account;
