import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Icon, Popup } from 'semantic-ui-react';
import Api from '../../../api';
import './noteOptions.css';


class NoteOptions extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.state = {};
  }

  handleDelete = async () => {
    const { node, tree } = this.props;
    const leafs = this.findLeafs(this.props.node.children);
    tree.children = this.filterTree(node.id, tree.children);
    await this.bulkDeleteNotes(leafs);
    await this.props.updateUser({ tree });
  }

  filterTree = (id, children) => children.filter((child) => {
    if (child.children && child.children.length && child.id !== id) {
      child.children = this.filterTree(id, child.children); // eslint-disable-line no-param-reassign
      return true;
    }
    return child.id !== id;
  })

  bulkDeleteNotes = async notes => Promise.all(notes.map(note => this.api.deleteNote({ note })))

  findLeafs = (branch) => {
    return branch.reduce((leafs, child) => {
      if (child.children && child.children.length) {
        return [...leafs, ...this.findLeafs(child.children)];
      }
      return child.leaf ? [...leafs, child] : leafs;
    }, []);
  }

  filterTree = (id, children) => children.filter((child) => {
    if (child.children && child.children.length && child.id !== id) {
      child.children = this.filterTree(id, child.children); // eslint-disable-line no-param-reassign
      return true;
    }
    return child.id !== id;
  })

  handleRename = () => {
    // this.props.enterRenameMode();
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
