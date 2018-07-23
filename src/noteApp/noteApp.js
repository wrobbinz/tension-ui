import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { union } from 'lodash';
import { routes, options } from '../api';
import NoteMenu from './noteMenu/noteMenu';
import Toolbar from './toolbar/toolbar';
import Editor from './editor/editor';
import Tags from './tags/tags';


class NoteApp extends Component {
  constructor(props) {
    super(props);
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
    const url = `${routes.users}/${this.props.user.id}/notes`;
    const { notes } = (await axios.get(url, options())).data;
    if (notes.length > 0) {
      notes.reverse();
      console.log('Notes:', notes);
      const note = notes[0];
      const tags = this.resolveTags(notes);
      this.setState({ note, notes, tags });
    }
  }

  selectNote = (note) => {
    console.log('Note:', note);
    this.setState({ note });
  }

  createNote = async (note = this.noteTemplate) => {
    try {
      const url = `${routes.users}/${this.props.user.id}/notes`;
      const newNote = (await axios.post(url, note, options())).data;

      const { notes } = this.state;
      notes.unshift(newNote);
      this.setState({ note: newNote, notes });
      return newNote;
    } catch (error) {
      throw new Error(error);
    }
  }

  updateNote = async (update, delay = false) => {
    try {
      const note = { ...this.state.note, ...update };
      const notes = this.findAndMerge(note, this.state.notes);
      const tags = this.resolveTags(notes);
      this.setState({ note, notes, tags });

      const url = `${routes.notes}/${note.id}`;
      if (!delay) return axios.patch(url, update, options());

      if (this.typingTimeout) { clearTimeout(this.typingTimeout); }
      this.typingTimeout = setTimeout(async () => axios.patch(url, update, options()), 1500);
      return 1500;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAndMerge = (newItem, staleArray) => staleArray
    .map(item => (item.id === newItem.id ? newItem : item));

  copyNote = (note) => {
    const { content, tags } = note;
    let { title } = note;
    title = `${title} copy`;
    this.createNote({ title, content, tags });
  }

  deleteNote = async (note) => {
    try {
      const { id } = note;
      const url = `${routes.notes}/${id}`;
      await axios.delete(url, options());

      let { notes } = this.state;
      notes = notes.filter(n => n.id !== id);
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
