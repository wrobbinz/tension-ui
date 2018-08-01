import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { union } from 'lodash';
import Api from '../api';
import NoteMenu from './noteMenu/noteMenu';
import Toolbar from './toolbar/toolbar';
import Editor from './editor/editor';
import Tags from './tags/tags';


class NoteApp extends Component {
  constructor(props) {
    super(props);
    this.api = new Api();
    this.editor = React.createRef();
    this.state = {
      notes: [],
      note: {},
      tags: [],
    };
    this.noteTemplate = {
      title: '',
      content: { ops: [{ insert: '\n' }] },
      tags: [],
    };
  }

  async componentWillMount() {
    const { user } = this.props;
    const { notes } = (await this.api.listNotes({ user })).data;
    if (notes.length > 0) {
      notes.reverse();
      const note = notes[0];
      const tags = this.resolveTags(notes);
      this.setState({ note, notes, tags });
    }
  }

  selectNote = (note) => {
    console.log('Note:', note);
    this.setState({ note });
  }

  createNote = async (data = this.noteTemplate) => {
    try {
      const { user } = this.props;
      const note = (await this.api.createNote({ user, note: data })).data;
      const notes = [note, ...this.state.notes];
      this.setState({ note, notes });
      return note;
    } catch (error) {
      throw new Error(error);
    }
  }

  updateNote = async (data, delay = false) => {
    try {
      const note = { ...this.state.note, ...data };
      const notes = this.findAndMerge(note, this.state.notes);
      const tags = this.resolveTags(notes);
      this.setState({ note, notes, tags });

      if (!delay) return this.api.updateNote({ note, data });

      if (this.typingTimeout) { clearTimeout(this.typingTimeout); }
      this.typingTimeout = setTimeout(async () => this.api.updateNote({ note, data }), 1500);
      return 1500;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAndMerge = (newItem, staleArray) => staleArray
    .map(item => (item.id === newItem.id ? newItem : item));

  copyNote = async (note) => {
    const { content, tags } = note;
    let { title } = note;
    title = `${title} copy`;
    const newNote = await this.createNote({ title, content, tags });
    this.addTreeLeaf(newNote);
  }

  addTreeLeaf = (note) => {
    const { tree } = this.props.user;
    const leaf = {
      id: note.id,
      leaf: true,
    };
    tree.children = [leaf, ...tree.children];
    this.props.updateUser({ tree });
  };

  filterTree = (id, children) => children.filter((child) => {
    if (child.children && child.children.length && child.id !== id) {
      child.children = this.filterTree(id, child.children); // eslint-disable-line no-param-reassign
      return true;
    }
    return child.id !== id;
  })

  deleteNote = async (note) => {
    try {
      await this.api.deleteNote({ note });

      const { user } = this.props;
      const { tree } = user;
      const { id } = note;
      tree.children = this.filterTree(id, tree.children);

      await this.props.updateUser({ tree });

      const notes = this.state.notes.filter(n => n.id !== id);
      const selectedNote = notes[0] || {};
      this.setState({ notes, note: selectedNote });
    } catch (error) {
      throw new Error(error);
    }
  }

  lockNote = async (locked) => {
    this.editor.current.lockNote(locked);
    await this.updateNote({ locked });
  }

  resolveTags = notes => union(...notes.map(n => n.tags));

  render() {
    const { note, notes, tags } = this.state;
    const { user, updateUser } = this.props;
    return (
      <div className="flex-wrapper flex-grow">
        {
          this.props.menuVisible ?
            <NoteMenu
              className="flex-shrink"
              user={user}
              updateUser={updateUser}
              notes={notes}
              note={note}
              addTreeLeaf={this.addTreeLeaf}
              filterTree={this.filterTree}
              selectNote={this.selectNote}
              createNote={this.createNote}
            /> : null
        }
        {
          this.state.notes.length > 0 ?
            <div className="editor flex-grow">
              <Toolbar
                note={note}
                updateNote={this.updateNote}
                lockNote={this.lockNote}
                copyNote={this.copyNote}
                deleteNote={this.deleteNote}
              />
              <Editor
                note={note}
                updateNote={this.updateNote}
                ref={this.editor}
              />
              <Tags
                note={note}
                tags={tags}
                updateNote={this.updateNote}
              />
            </div> : null
        }
      </div>
    );
  }
}

NoteApp.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateUser: PropTypes.func,
  menuVisible: PropTypes.bool,
};

NoteApp.defaultProps = {
  user: {},
  updateUser: null,
  menuVisible: true,
};

export default NoteApp;
