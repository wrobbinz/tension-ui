import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import './NoteTreeActions.css';


class NoteTreeActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addFolder = () => {
    const { tree } = this.props.user;
    const folder = {
      module: 'New Folder',
      id: uuidv4(),
      collapsed: true,
      children: [],
    };
    tree.children = [folder, ...tree.children];
    this.props.updateUser({ tree });
  }

  render() {
    return (
      <Button.Group basic fluid size="tiny">
        <Button
          onClick={this.addFolder}
          icon
        >
          <Icon.Group>
            <Icon name="folder" />
            <Icon corner name="add" color="blue" />
          </Icon.Group>
        </Button>
        <Button icon>
          <Icon name="align center" />
        </Button>
        <Button icon>
          <Icon name="align center" />
        </Button>
        <Button icon>
          <Icon name="align center" />
        </Button>
      </Button.Group>
    );
  }
}

NoteTreeActions.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
};

NoteTreeActions.defaultProps = {
  user: {},
  updateUser: null,
};

export default NoteTreeActions;
