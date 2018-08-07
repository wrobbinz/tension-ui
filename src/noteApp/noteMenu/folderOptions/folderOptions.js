import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Icon, Popup, Modal, Header, Button } from 'semantic-ui-react';
import Api from '../../../api';
import './folderOptions.css';


class folderOptions extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {
      isOpen: false,
    };
  }

  handleDelete = (e) => {
    e.stopPropagation();
    this.setState({ isOpen: false });
    const { node } = this.props;
    const leafs = this.findLeafs(node.children);
    if (leafs.length) {
      this.leafs = leafs;
      this.openModal();
    } else {
      this.deleteNotes(leafs);
    }
  }

  handleConfirmDelete = () => {
    this.deleteNotes(this.leafs);
  }

  deleteNotes = async (notes = this.leafs) => {
    console.log(notes)
    const { node, tree } = this.props;
    tree.children = this.filterTree(node.id, tree.children);
    await Promise.all(notes.map(note => this.api.deleteNote({ note })));
    await this.props.updateUser({ tree });
  }

  filterTree = (id, children) => children.filter((child) => {
    if (child.children && child.children.length && child.id !== id) {
      child.children = this.filterTree(id, child.children); // eslint-disable-line no-param-reassign
      return true;
    }
    return child.id !== id;
  })

  findLeafs = branch => branch.reduce((leafs, child) => (
    child.children ? [...leafs, ...this.findLeafs(child.children)] : [...leafs, child]
  ), [])

  filterTree = (id, children) => children.filter((child) => {
    if (child.children && child.children.length && child.id !== id) {
      child.children = this.filterTree(id, child.children); // eslint-disable-line no-param-reassign
      return true;
    }
    return child.id !== id;
  })

  handleRename = (e) => {
    e.stopPropagation();
    this.setState({ isOpen: false });
    const { node } = this.props;
    this.props.enterRenameMode(node);
  }

  handleClick = () => this.setState({ isOpen: !this.state.isOpen })

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  handleModalClose = (e) => {
    e.stopPropagation();
    this.setState({ modalOpen: false });
  }

  renderOptions = () => (
    <List>
      <List.Item
        onClick={this.handleRename}
        icon="pencil"
        content="Rename Folder"
        className="pointer"
      />
      <List.Item
        onClick={this.handleDelete}
        icon="times"
        content="Delete Folder"
        className="pointer"
      />
    </List>
  )

  render() {
    return (
      <div className="float-right">
        <Popup
          onClose={this.handleClick}
          trigger={
            <Icon
              name="ellipsis horizontal"
              color="grey"
              className="hidden float-right"
              onClick={(e) => { e.stopPropagation(); }}
            />
          }
          content={this.renderOptions()}
          on="click"
          open={this.state.isOpen}
          onOpen={this.handleClick}
          position="right center"
          size="tiny"
          inverted
          hideOnScroll
        />
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
          basic
          size="small"
        >
          <Header icon="trash" content="Are you sure?" />
          <Modal.Content>
            <p>
              This folder has stuff in it? Deleting this will delete all of its contents.
              Are you sure you want to do that?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleModalClose} basic color="grey" inverted>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="red" onClick={this.handleConfirmDelete} inverted>
              <Icon name="remove" /> Delete
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

folderOptions.propTypes = {
  node: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

folderOptions.defaultProps = {
  node: {},
  user: {},
  updateUser: null,
  notes: [],
  selectNote: null,
};

export default folderOptions;
