import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios'
import { reverse, remove } from 'lodash'
import { EditorState } from 'draft-js'
import { Grid, Header, Icon } from 'semantic-ui-react'
import NoteMenu from './noteMenu'
import NoteEditor from './noteEditor'
import api from '../api'


class NoteApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      note: {
        title: 'Untitled Note',
        content: EditorState.createEmpty(),
      },
    }
  }

  componentWillMount() {
    axios.get(api.notes, api.config())
      .then((res) => {
        const notes = reverse(res.data)
        if (notes.length > 0) {
          const note = notes[0]
          this.setState({ notes, note })
        }
      })
  }

  selectNote = (id) => {
    const note = this.state.notes.find(n => n.id === id)
    console.log('Selected:', note)
    this.setState({ note })
  }

  createNote = (title = 'Untitled Note', content = EditorState.createEmpty()) => {
    const payload = { title, content }
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
    const { content } = note
    let { title } = note
    title = `${title} copy`
    this.createNote(title, content)
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

  updateContent = (editorState) => {
    const { note } = this.state
    note.content = editorState
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
        {
          this.state.notes.length > 0 ?
            <NoteEditor
              note={this.state.note}
              updateTitle={this.updateTitle}
              updateContent={this.updateContent}
            /> :
            <Grid
              className="editor float-left"
              verticalAlign="middle"
              columns={1}
            >
              <Grid.Row>
                <Grid.Column centered="true" textAlign="center">
                  <Header className="light-grey" as="h2" icon>
                    <Icon name="sticky note" />
                    Click the + icon to create a new note
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
        }
      </div>
    )
  }
}

export default NoteApp
