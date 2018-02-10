import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { reverse, remove } from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Menu, Input, Icon, Header } from 'semantic-ui-react'
import NoteOptions from './noteOptions'
import NoteEditor from './noteEditor'
import api from './api'


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

class WorkMenu extends Component {
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

  onDragEnd = (result) => {
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

  updateContents = (contents) => {
    const { note } = this.state
    note.contents = contents
    this.setState({ note })
  }

  render() {
    return (
      <div className="full-height">
        <Menu pointing secondary vertical className="full-height" floated>
          <Menu.Item>
            <Header as="h3" floated="left">Notes</Header>
            <Icon
              link
              onClick={() => { this.createNote() }}
              size="large"
              name="plus"
              floated="right"
            />
          </Menu.Item>
          <Menu.Item>
            <Input icon="search" iconPosition="left" placeholder="Search..." />
          </Menu.Item>
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
                              <NoteOptions
                                note={this.state.note}
                                deleteNote={this.deleteNote}
                                copyNote={this.copyNote}
                              />
                            </Menu.Item>
                          </div>
                          {prov.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Menu>
        {this.state.note ?
          <NoteEditor
            note={this.state.note}
            updateTitle={this.updateTitle}
            updateContents={this.updateContents}
          /> : null
        }
      </div>
    )
  }
}

WorkMenu.propTypes = {
  focus: PropTypes.string,
}

WorkMenu.defaultProps = {
  focus: false,
}

export default WorkMenu
