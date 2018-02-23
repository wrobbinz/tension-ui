import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import axios from 'axios'
import { reverse, remove } from 'lodash'
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js'
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
        content: convertToRaw(ContentState.createFromText('...')),
      },
      editorState: EditorState.createEmpty(),
    }
  }

  componentWillMount() {
    axios.get(api.notes, api.config())
      .then((res) => {
        const notes = reverse(res.data)
        if (notes.length > 0) {
          const note = notes[0]
          const editorState = EditorState.createWithContent(convertFromRaw(note.content))
          this.setState({ notes, note, editorState })
        }
      })
  }

  selectNote = (id) => {
    const note = this.state.notes.find(n => n.id === id)
    console.log('Selected:', note)
    const editorState = EditorState.createWithContent(convertFromRaw(note.content))
    this.setState({ note, editorState })
  }

  createNote = (title = 'Untitled Note', content = convertToRaw(ContentState.createFromText(''))) => {
    const payload = { title, content }
    axios.post(api.notes, payload, api.config())
      .then((res) => {
        const { notes } = this.state
        notes.unshift(res.data)
        const note = res.data
        const editorState = EditorState.createWithContent(convertFromRaw(note.content))
        this.setState({ notes, note, editorState })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  saveNote = (id) => {
    const { title, content } = this.state.note
    const payload = { title, content }
    axios.put(`${api.notes}${id}`, payload, api.config())
      .then((res) => {
        console.log('saveNote res:', res)
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
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)
    note.content = rawContent
    this.setState({ note, editorState })
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
          saveNote={this.saveNote}
          updateOrder={this.updateOrder}
        />
        {
          this.state.notes.length > 0 ?
            <NoteEditor
              note={this.state.note}
              editorState={this.state.editorState}
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

NoteApp.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteApp.defaultProps = {
  user: null,
}

export default NoteApp
