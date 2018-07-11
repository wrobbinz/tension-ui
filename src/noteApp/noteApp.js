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
    this.state = {
      notes: [],
      note: {},
      userTags: [],
    };
    this.noteTemplate = {
      title: '',
      content: { ops: [{ insert: '\n' }] },
      tags: [],
    };
  }

  async componentWillMount() {
    const url = `${routes.users}/${this.props.user.id}/notes`;
    const notesResponse = (await axios.get(url, options())).data.notes;
    console.log(notesResponse);
    const notes = notesResponse.reverse();
    if (notes.length > 0) {
      const note = notes[0];
      const userTags = this.props.user.tags || [];
      this.setState({
        notes,
        note,
        userTags,
      });
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
    } catch (error) {
      throw new Error(error);
    }
  }

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

  addUserTag = async (value) => {
    try {
      const payload = { tags: [{ text: value, value, key: value }, ...this.state.userTags] };
      const url = `${routes.users}${this.props.user.id}`;
      const updatedUser = await axios.put(url, payload, options());
      this.setState({ userTags: updatedUser.data.tags });
    } catch (error) {
      throw new Error(error);
    }
  }

  updateNoteTags = async (value) => {
    try {
      const { note } = this.state;
      const tags = value.map(tag => (tag.value ? tag : { text: tag, value: tag, key: tag }));
      const payload = { tags };
      const url = `${routes.notes}${this.state.note.id}`;
      const updatedNote = await axios.put(url, payload, options());
      note.tags = updatedNote.data.tags;
      this.setState({ note });
    } catch (err) {
      throw err;
    }
  }

  async removeStaleTags() {
    const { notes, userTags } = this.state;
    const allNoteTags = union(notes.reduce((tags, note) => tags.concat(note.tags), []));
    const usedTags = userTags.filter(tag => allNoteTags.includes(tag));
    if (usedTags !== this.state.userTags) {
      try {
        const payload = { tags: usedTags };
        const url = `${routes.users}${this.props.user.id}`;
        const updatedUser = await axios.put(url, payload, options());
        this.setState({ userTags: updatedUser.data.tags });
      } catch (err) {
        throw err;
      }
    }
  }

  updateNote = async (update, delay = false) => {
    try {
      const note = { ...this.state.note, ...update };
      const notes = this.findAndMerge(note, this.state.notes);
      this.setState({ note, notes });

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

  render() {
    const { note, notes } = this.state;
    return (
      <div className="flex-wrapper flex-grow">
        {
          this.props.menuVisible ?
            <NoteMenu
              className="flex-shrink"
              notes={notes}
              note={note}
              selectNote={this.selectNote}
              createNote={this.createNote}
              userTags={this.state.userTags}
              addUserTag={this.addUserTag}
            /> : null
        }
        {
          this.state.notes.length > 0 ?
            <div className="editor flex-grow">
              <Toolbar
                note={note}
                updateNote={this.updateNote}
                copyNote={this.copyNote}
                deleteNote={this.deleteNote}
              />
              <Editor
                note={note}
                updateNote={this.updateNote}
              />
              <Tags
                note={note}
                userTags={this.props.userTags}
                addUserTag={this.props.addUserTag}
                updateNoteTags={this.props.updateNoteTags}
                placeholder="# Tags"
              />
            </div> : null
        }
      </div>
    );
  }
}

NoteApp.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  menuVisible: PropTypes.bool,
};

NoteApp.defaultProps = {
  user: {},
  menuVisible: true,
};

export default NoteApp;
