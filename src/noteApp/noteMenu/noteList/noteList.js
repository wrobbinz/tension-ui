import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { List, Input, Icon } from 'semantic-ui-react';
import FolderOptions from '../folderOptions/folderOptions';
import Tree from './tree/react-ui-tree';
import './noteList.css';


class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: this.props.tree,
      node: {},
    };
  }

  onKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        return this.exitRenameMode();
      case 'Enter':
        this.renameFolder();
        return this.exitRenameMode();
      default:
        return null;
    }
  }

  enterRenameMode = (node) => {
    this.setState({ node, isEditing: true });
  }

  exitRenameMode = () => {
    this.setState({ node: {}, isEditing: false });
  }

  handleNoteClick = (id) => {
    const note = this.noteById(id);
    this.props.selectNote(note);
  }

  renameFolder = () => {
    const { tree } = this.props;
    const { node } = this.state;
    tree.children = this.replaceNode(node, tree.children);
    this.props.updateUser({ tree });
  }

  replaceNode = (node, children) => children.map((child) => {
    if (child.children && child.id !== node.id) {
      child.children = this.replaceNode(node, child.children);
      return child;
    }
    if (child.id === node.id) {
      child.module = node.module;
      return child;
    }
    return child;
  })

  handleChange = (newTree) => {
    this.props.updateUser({ tree: newTree });
  }

  matchNotes = () => {
    if (this.state.view === 'favorites') {
      return this.props.notes.filter(note => note.favorite);
    }
    if (this.state.search) {
      const search = this.state.search.toLowerCase();
      return this.props.notes.filter((note) => {
        const matchedTags = note.tags.map(tag => tag.toLowerCase()).includes(search);
        const matchedTitle = note.title.toLowerCase().includes(search);
        return matchedTags || matchedTitle;
      });
    }
    return this.props.notes;
  }

  buildTree = () => {
    const { tree } = this.props;
    const newTree = { ...tree };
    newTree.children = this.matchNotesToChildren(tree.children);
    return newTree;
  }

  matchNotesToChildren = children => children.map((child) => {
    const matchedChild = child;
    if (child.leaf && child.id) {
      const note = this.noteById(child.id);
      if (note) {
        matchedChild.module = note.title || 'Untitled Note';
      }
      return matchedChild;
    }
    if (child.children && child.children.length) {
      matchedChild.children = this.matchNotesToChildren(child.children);
      return matchedChild;
    }
    return matchedChild;
  });

  noteById = id => this.props.notes.find(note => note.id === id)

  handleRenameChange = (e, { value }) => {
    const { node } = this.state;
    node.module = value;
    this.setState({ node });
  }

  renderNode = (node) => {
    const { tree, updateUser } = this.props;
    return (
      <List.Item
        className={cx('node', {
          'is-active': node === this.active,
          'tree-leaf': true,
        })}
      >
        {
          this.state.node.id === node.id ?
          (
            <Input
              autoFocus
              value={this.state.renameValue}
              onChange={this.handleRenameChange}
              onKeyDown={this.onKeyDown}
              onClick={(e) => { e.stopPropagation(); }}
              onBlur={() => this.setState({ node: {}, isEditing: false })}
              transparent
              className="folder-input"
              icon={
                <Icon
                  name="times"
                  color="grey"
                  link
                />
              }
            />
          ) : node.module
        }
        {
          node.children && !this.state.isEditing ?
            (
              <FolderOptions
                tree={tree}
                node={node}
                updateUser={updateUser}
                enterRenameMode={this.enterRenameMode}
              />
            ) : null
        }
      </List.Item>
    );
  }

  render() {
    return (
      <List>
        <Tree
          paddingLeft={20}
          onChange={this.handleChange}
          tree={this.buildTree()}
          renderNode={this.renderNode}
          handleNoteClick={this.handleNoteClick}
        />
      </List>
    );
  }
}

NoteList.propTypes = {
  tree: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

NoteList.defaultProps = {
  tree: {},
  updateUser: null,
  notes: [],
  selectNote: null,
};

export default NoteList;
