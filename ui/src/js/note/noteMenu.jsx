import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Menu, Dropdown, Icon, Header } from 'semantic-ui-react'
import NoteOptions from './noteOptions'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class NoteMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const notes = reorder(
      this.props.notes,
      result.source.index,
      result.destination.index,
    )

    this.props.updateOrder(notes)
  }

  render() {
    return (
      <Menu size="large" pointing secondary vertical className="full-height" floated>
        <Menu.Item>
          <Header as="h3" floated="left">Notes</Header>
          <Icon
            link
            onClick={() => { this.props.createNote() }}
            size="large"
            name="plus"
            floated="right"
          />
        </Menu.Item>
        <Menu.Item>
          <Dropdown placeholder="Search..." search selection options={[{ key: 'CD', value: 'coding', text: '#coding' }]} />
        </Menu.Item>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div
                ref={provided.innerRef}
              >
                {this.props.notes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index}>
                    {prov => (
                      <div>
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                        >
                          <Menu.Item
                            onClick={() => { this.props.selectNote(note.id) }}
                            name={note.id.toString()}
                            active={this.props.note.id === note.id}
                            id={note.id}
                          >
                            {note.title === '' ? 'Untitled Note' : note.title}
                            <NoteOptions
                              note={this.props.note}
                              deleteNote={this.props.deleteNote}
                              copyNote={this.props.copyNote}
                              saveNote={this.props.saveNote}
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
    )
  }
}

NoteMenu.propTypes = {
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
  copyNote: PropTypes.func,
  deleteNote: PropTypes.func,
  updateOrder: PropTypes.func,
  saveNote: PropTypes.func,
}

NoteMenu.defaultProps = {
  notes: false,
  note: null,
  selectNote: false,
  createNote: false,
  copyNote: false,
  deleteNote: false,
  updateOrder: false,
  saveNote: null,
}

export default NoteMenu
