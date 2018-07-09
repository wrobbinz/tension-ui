import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { remove, union } from 'lodash';
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
      note: {
        title: 'Untitled Note',
        content: '',
        tags: [],
      },
      userTags: [],
      isSaved: true,
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

  selectNote = (id) => {
    const note = this.state.notes.find(n => n.id === id);
    console.log('Note:', note);
    this.setState({ note });
  }

  createNote = async (title = 'Untitled Note', content = {}) => {
    try {
      const payload = { title, content };
      const url = `${routes.users}/${this.props.user.id}/notes`;
      const note = (await axios.post(url, payload, options())).data;

      const { notes } = this.state;
      notes.unshift(note);
      this.setState({ note, notes });
    } catch (error) {
      throw new Error(error);
    }
  }

  saveNote = async (id) => {
    try {
      const { title, content } = this.state.note;
      const payload = { title, content };
      return axios.patch(`${routes.notes}/${id}`, payload, options());
    } catch (error) {
      throw error;
    }
  }

  copyNote = (id) => {
    const note = this.state.notes.find(n => n.id === id);
    const { content } = note;
    let { title } = note;
    title = `${title} copy`;
    this.createNote(title, content);
  }

  deleteNote = (id) => {
    axios.delete(`${routes.notes}${id}`, options())
      .then(() => {
        const { notes } = this.state;
        remove(notes, note => note.id === id);
        const note = notes[0] || null;
        this.setState({ notes, note });
      })
      .catch((err) => {
        throw err;
      });
  }

  updateOrder = (notes) => {
    this.setState({ notes });
  }

  addUserTag = async (value) => {
    try {
      const payload = { tags: [{ text: value, value, key: value }, ...this.state.userTags] };
      const url = `${routes.users}${this.props.user.id}`;
      const updatedUser = await axios.put(url, payload, options());
      this.setState({ userTags: updatedUser.data.tags });
    } catch (err) {
      throw err;
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

  updateRating = async (rating) => {
    const isFavorite = rating === 1;
    const payload = { is_favorite: isFavorite };
    const url = `${routes.notes}${this.state.note.id}`;
    await axios.put(url, payload, options());
    const { note } = this.state;
    note.is_favorite = isFavorite;
    this.setState({ note });
  }

  updateNoteDelay = async (note) => {
    const notes = this.findAndMerge(note, this.state.notes);
    this.setState({ note, notes });
    /* Save to DB when user finishes typing */
    await this.setUpdateDelay(note);
  }

  setUpdateDelay = async (note) => {
    if (this.typingTimeout) { clearTimeout(this.typingTimeout); }

    this.typingTimeout = setTimeout(async () => {
      await this.updateNote(note);
    }, 1000);
  }

  updateNote = async (note) => {
    try {
      const { id, title, content } = note;
      const payload = { title, content };
      const url = `${routes.notes}/${id}`;
      return (await axios.patch(url, payload, options())).data;
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
              copyNote={this.copyNote}
              deleteNote={this.deleteNote}
              updateOrder={this.updateOrder}
              userTags={this.state.userTags}
              addUserTag={this.addUserTag}
            /> : null
        }
        {
          this.state.notes.length > 0 ?
            <div className="editor flex-grow">
              <Toolbar
                note={note}
                updateNoteDelay={this.updateNoteDelay}
              />
              <Editor
                note={note}
                updateNoteDelay={this.updateNoteDelay}
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
