import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import axios from 'axios'
import Editor from './editor.jsx'


class Workspace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      activeNote: {},
      noteValue: '',
      activeItem: 'notes',
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.createNote = this.createNote.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    axios.get('http://localhost:3333/api/v1/notes', {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('jwtToken')}`,
      },
    })
      .then((res) => {
        const notes = res.data
        const activeNote = notes[0]
        const noteValue = activeNote.contents
        this.setState({ notes, activeNote, noteValue })
      })
  }

  handleItemClick(e, { name, id }) {
    const activeNote = this.state.notes.find(note => note.id === id)
    this.setState({
      activeNote,
      noteValue: activeNote.contents,
      activeItem: name,
    })
  }

  createNote() {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('jwtToken')}`,
      },
    }
    const payload = {
      title: 'new note',
      contents: ' ',
    }
    axios.post('http://localhost:3333/api/v1/notes', payload, config)
      .then((res) => {
        const { notes } = this.state
        notes.push(res.data)
        const activeNote = res.data
        const noteValue = activeNote.contents
        this.setState({ notes, activeNote, noteValue })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  deleteNote() {
    const { id } = this.state.activeNote
    axios.delete('http://localhost:3333/api/v1/notes', { params: { id } })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    const { activeItem } = this.state
    return (
      <div>
        <Menu vertical inverted>
          <Menu.Item>
            <Icon link onClick={this.createNote} name="plus" /><Menu.Header>Notes</Menu.Header>
            <Menu.Menu>
              {this.state.notes.map(note => (
                <div>
                  <Menu.Item
                    name={note.title}
                    active={activeItem === note.id}
                    onClick={this.handleItemClick}
                    id={note.id}
                    key={note.id}
                  />
                </div>
              ))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
        <Editor />
      </div>
    )
  }
}

export default Workspace
