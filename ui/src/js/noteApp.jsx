import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios'
import { reverse, remove } from 'lodash'
import NoteMenu from './noteMenu'
import NoteEditor from './noteEditor'
import api from './api'


class NoteApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      note: {
        title: '...',
        contents: '',
      },
    }
  }

  componentWillMount() {
    axios.get(api.notes, api.config())
      .then((res) => {
        const notes = reverse(res.data)
        const note = notes[0]
        this.setState({ notes, note })
      })
  }

  selectNote = (id) => {
    const note = this.state.notes.find(n => n.id === id)
    console.log('selected', note)
    this.setState({ note })
  }

  createNote = (title = '', contents = '') => {
    const payload = { title, contents }
    axios.post(api.notes, payload, api.config())
      .then((res) => {
        const { notes } = this.state
        notes.unshift(res.data)
        const note = res.data
        this.setState({ notes, note })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  copyNote = (id) => {
    const note = this.state.notes.find(n => n.id === id)
    const { contents } = note
    let { title } = note
    title = `${title} copy`
    this.createNote(title, contents)
  }

  deleteNote = (id) => {
    axios.delete(`${api.notes}${id}`, api.config())
      .then(() => {
        const { notes } = this.state
        remove(notes, note => note.id === id)
        const note = notes[0] || null
        this.setState({ notes, note })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  updateTitle = (event) => {
    const { note } = this.state
    note.title = event.target.value
    this.setState({ note })
  }

  updateContents = (markdown) => {
    const { note } = this.state
    note.contents = markdown
    this.setState({ note })
  }

  updateOrder = (notes) => {
    this.setState({ notes })
  }

  render() {
    return (
      <div className="full-height">
        <NoteMenu
          notes={this.state.notes}
          note={this.state.note}
          selectNote={this.selectNote}
          createNote={this.createNote}
          copyNote={this.copyNote}
          deleteNote={this.deleteNote}
          updateOrder={this.updateOrder}
        />
        <NoteEditor
          note={this.state.note}
          updateTitle={this.updateTitle}
          updateContents={this.updateContents}
        />
      </div>
    )
  }
}

export default NoteApp
