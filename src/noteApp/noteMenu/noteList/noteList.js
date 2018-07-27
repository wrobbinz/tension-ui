import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { List } from 'semantic-ui-react';
import Tree from './tree/react-ui-tree';
import './noteList.css';


class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClickNode = (node) => {
    this.active = node;
    // const note = this.noteById(node.noteId);
    // this.props.selectNote(note);
  }

  handleChange = (tree) => {
    this.props.updateUser({ tree });
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
    if (this.props.notes.length) {
      const { tree } = this.props.user;
      const newTree = { ...tree };
      newTree.children = this.matchNotesToChildren(tree.children);
      return newTree;
    }
    return {};
  }

  matchNotesToChildren = children => children.map((child) => {
    const matchedChild = child;
    if (child.leaf && child.noteId) {
      const note = this.noteById(child.noteId);
      matchedChild.module = note.title || 'Untitled Note';
      return matchedChild;
    }
    if (child.children && child.children.length) {
      matchedChild.children = this.matchNotesToChildren(child.children);
      return matchedChild;
    }
    return matchedChild;
  });

  noteById = id => this.props.notes.find(note => note.id === id)

  renderNode = node => (
    <List.Item
      className={cx('node', {
        'is-active': node === this.active,
        'tree-leaf': true,
      })}
      onClick={this.onClickNode}
    >
      {node.module}
    </List.Item>
  )

  render() {
    return (
      <List>
        <Tree
          paddingLeft={20}
          onChange={this.handleChange}
          tree={this.buildTree()}
          renderNode={this.renderNode}
        />
      </List>
    );
  }
}

NoteList.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

NoteList.defaultProps = {
  user: {},
  updateUser: null,
  notes: [],
  selectNote: null,
};

export default NoteList;
