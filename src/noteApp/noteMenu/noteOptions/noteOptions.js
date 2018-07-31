import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Icon, Popup } from 'semantic-ui-react';
import './noteOptions.css';


class NoteOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDelete = () => {
    const { id } = this.props.node;

  }

  handleRename = () => {
    this.props.enterRenameMode();
  }

  renderOptions = () => (
    <List>
      <List.Item icon="pencil" content="Rename Folder" />
      <List.Item
        onClick={this.handleDelete}
        icon="times"
        content="Delete Folder"
      />
    </List>
  )

  render() {
    return (
      <Popup
        trigger={
          <Icon
            name="ellipsis horizontal"
            color="grey"
            className="hidden"
            onClick={(e) => { e.stopPropagation(); }}
          />
        }
        content={this.renderOptions()}
        on="click"
        position="right center"
        size="tiny"
        inverted
        hideOnScroll
      />
    );
  }
}

NoteOptions.propTypes = {
  node: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

NoteOptions.defaultProps = {
  node: {},
  user: {},
  updateUser: null,
  notes: [],
  selectNote: null,
};

export default NoteOptions;
