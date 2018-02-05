import React, { Component } from 'react'
import { Sidebar, Segment, Menu, Icon, Input } from 'semantic-ui-react'
import axios from 'axios'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { remove, reverse } from 'lodash'
import api from './api'
import '../css/style.css'
import Editor from './editor'
import NoteMenu from './noteMenu'


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

class Workspace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      notes: [],
      note: {
        title: '...',
        contents: '',
      },
    }
    this.selectNote = this.selectNote.bind(this)
    this.createNote = this.createNote.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.toggleVisibility = this.toggleVisibility.bind(this)
    this.updateContents = this.updateContents.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)

    axios.get(api.notes, api.config())
      .then((res) => {
        const notes = reverse(res.data)
        const note = notes[0]
        this.setState({ notes, note })
        this.setState({ notes })
      })
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const notes = reorder(
      this.state.notes,
      result.source.index,
      result.destination.index,
    )

    this.setState({
      notes,
    })
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible,

    })
  }

  selectNote(id) {
    const note = this.state.notes.find(n => n.id === id)
    console.log('selected', note)
    this.setState({ note })
  }

  createNote() {
    const payload = {
      title: '',
      contents: '',
    }
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

  deleteNote(id) {
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

  updateTitle(event) {
    const { note } = this.state
    note.title = event.target.value
    this.setState({ note })
  }

  updateContents(event) {
    const { note } = this.state
    note.contents = event.target.value
    this.setState({ note })
  }

  render() {
    return (
      <div className="full-height">
        <Sidebar.Pushable as={Segment} className="no-border-radius no-border">
          <Sidebar
            as={Menu}
            animation="push"
            visible={this.state.visible}
            className="full-height"
            vertical
            inverted
          >
            <Menu.Item>Notes
              <Icon link onClick={() => { this.createNote() }} name="plus" />
            </Menu.Item>
            <Menu.Menu>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {provided => (
                    <div
                      ref={provided.innerRef}
                    >
                      {this.state.notes.map((note, index) => (
                        <Draggable key={note.id} draggableId={note.id} index={index}>
                          {prov => (
                            <div>
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <Menu.Item
                                  onClick={() => { this.selectNote(note.id) }}
                                  name={note.id.toString()}
                                  active={this.state.note.id === note.id}
                                  id={note.id}
                                >
                                  {note.title === '' ? 'Untitled Note' : note.title}
                                  <NoteMenu />
                                </Menu.Item>
                              </div>
                              {prov.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Menu.Menu>
          </Sidebar>
          <Sidebar.Pusher className="full-height">
            {this.state.note ?
              <div>
                <Icon link onClick={this.toggleVisibility} flipped={this.state.visible ? 'horizontally' : null} name="angle right" size="big" />
                <Input
                  id="titleInput"
                  className="no-border"
                  size="big"
                  placeholder="Title"
                  value={this.state.note ? this.state.note.title : ''}
                  maxLength="20"
                  onChange={(event) => { this.updateTitle(event) }}
                />
                <Editor updateContents={this.updateContents} note={this.state.note} />
              </div> : null
            }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default Workspace
