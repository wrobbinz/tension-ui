import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Modal, Header, Button } from 'semantic-ui-react';


class NoteOptions extends Component {
  static propTypes = {
    note: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    lockNote: PropTypes.func.isRequired,
    copyNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLock = () => {
    const { locked } = this.props.note;
    this.props.lockNote(!locked);
  }

  handleCopy = () => {
    const { note } = this.props;
    this.props.copyNote(note);
  }

  handleDelete = () => {
    const { note } = this.props;
    this.props.deleteNote(note);
    this.handleClose();
  }

  handleOpen = () => { this.setState({ deleteModalOpen: true }); }
  handleClose = () => { this.setState({ deleteModalOpen: false }); }

  render() {
    const { note } = this.props;
    return (
      <Dropdown className="icon" icon="content" color="grey" floating basic>
        <Dropdown.Menu>
          <Dropdown.Item icon="share alternate" text="Share" disabled />
          <Dropdown.Item
            icon="copy"
            text="Duplicate"
            onClick={this.handleCopy}
          />
          <Dropdown.Item icon="external square" text="Export" disabled />
          <Dropdown.Divider />
          <Dropdown.Item
            icon={note.locked ? 'unlock' : 'lock'}
            text={note.locked ? 'Unlock note' : 'Lock note'}
            onClick={this.handleLock}
          />
          <Dropdown.Item icon="save" text="Save new version" disabled />
          <Dropdown.Item icon="undo alternate" text="Revert to previous version" disabled />
          <Dropdown.Divider />
          <Dropdown.Item icon="info circle" text="Information" disabled />
          <Modal
            trigger={
              <Dropdown.Item
                icon="trash"
                text="Delete"
                onClick={this.handleOpen}
              />
            }
            open={this.state.deleteModalOpen}
            onClose={this.handleClose}
            basic
            size="small"
          >
            <Header
              icon="trash"
              content={
                `Delete ${note.title || 'untitled'} note?`
              }
            />
            <Modal.Content>
              <p>Are you sure you want to delete this note? (This action cannot be undone)</p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.handleClose} basic color="grey" inverted>
                <Icon name="remove" /> Cancel
              </Button>
              <Button color="red" onClick={this.handleDelete} inverted>
                <Icon name="remove" /> Delete
              </Button>
            </Modal.Actions>
          </Modal>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default NoteOptions;
