import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { List } from 'semantic-ui-react';
import { isEqual } from 'lodash';
import NoteOptions from '../noteOptions/noteOptions';
import Tree from './tree/react-ui-tree';
import './noteList.css';


class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: this.props.tree,
    };
  }

  handleNoteClick = (id) => {
    const note = this.noteById(id);
    this.props.selectNote(note);
  }

  handleChange = (tree) => {
    if (!isEqual(tree, this.state.tree)) {
      this.props.updateUser({ tree });
      this.setState({ tree });
    }
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

  renderNode = (node) => {
    const { tree, updateUser } = this.props;
    return (
      <List.Item
        className={cx('node', {
          'is-active': node === this.active,
          'tree-leaf': true,
        })}
      >
        {node.module}
        {
          node.children ?
            (
              <NoteOptions
                tree={tree}
                node={node}
                updateUser={updateUser}
              />
            ) : null
        }
      </List.Item>
    )
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
