import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Resizable from 're-resizable';
import { Menu, List, Icon, Button } from 'semantic-ui-react';
import Search from './search/search';
import './noteMenu.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const resizeDirections = {
  top: false,
  right: true,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

class NoteMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      noteView: 'all',
    };
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const notes = reorder(
      this.props.notes,
      result.source.index,
      result.destination.index,
    );

    // this.props.updateOrder(notes);
  }

  updateSearchValue = (value) => {
    this.setState({ searchValue: value });
  }

  matchNotes = () => {
    if (this.state.noteView === 'favorites') {
      return this.props.notes.filter(note => note.isFavorite);
    }
    if (this.state.searchValue) {
      const searchValue = this.state.searchValue.toLowerCase();
      const matchedNotes = this.props.notes.filter((note) => {
        let found = false;
        note.tags.forEach((tag) => {
          if (tag.value.toLowerCase().includes(searchValue)) {
            found = true;
          }
        });
        note.content.blocks.forEach((block) => {
          if (block.text.toLowerCase().includes(searchValue)) {
            found = true;
          }
        });
        if (note.title.toLowerCase().includes(searchValue)) {
          found = true;
        }
        return found;
      });
      return matchedNotes;
    }
    return this.props.notes;
  }

  handleViewChange = noteView => this.setState({ noteView })

  handleSelect = (e, data) => {
    const { note } = data;
    this.props.selectNote(note);
  }

  render() {
    return (
      <Resizable
        className="resize-indicator"
        minWidth="250"
        maxWidth="40%"
        defaultSize={{ width: 250 }}
        enable={resizeDirections}
      >
        <Menu
          className="note-menu full-height full-width"
          size="large"
          pointing
          secondary
          vertical
          floated
        >
          <Menu.Item>
            <Search
              searchValue={this.state.searchValue}
              userTags={this.props.userTags}
              updateSearchValue={this.updateSearchValue}
              createNote={this.props.createNote}
            />
          </Menu.Item>
          <Menu.Item>
            <List>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {provided => (
                    <div
                      className="note-list"
                      ref={provided.innerRef}
                    >
                      {this.matchNotes().map((note, index) => (
                        <Draggable key={note.id} draggableId={note.id} index={index}>
                          {prov => (
                            <div>
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                              >
                                <List.Item
                                  className="note-list-item truncate"
                                  note={note}
                                  onClick={this.handleSelect}
                                  name={note.id.toString()}
                                  active={this.props.note.id === note.id}
                                  id={note.id}
                                >
                                  <List.Icon
                                    className="note-icon"
                                    name={this.props.note.id === note.id ? 'sticky note' : 'sticky note outline'}
                                  />
                                  <List.Description>
                                    {note.title === '' ? 'Untitled Note' : note.title}
                                  </List.Description>
                                </List.Item>
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
            </List>
          </Menu.Item>
          <Menu.Item id="noteView">
            <Button.Group size="mini" widths="3" fluid basic>
              <Button
                onClick={() => { this.handleViewChange('all'); }}
                active={this.state.noteView === 'all'}
              >
                All
              </Button>
              <Button
                onClick={() => { this.handleViewChange('tags'); }}
                active={this.state.noteView === 'tags'}
              >
                Tags
              </Button>
              <Button
                onClick={() => { this.handleViewChange('favorites'); }}
                active={this.state.noteView === 'favorites'}
                icon
              >
                <Icon
                  color={this.state.noteView === 'favorites' ? 'red' : 'grey'}
                  name="heart"
                />
              </Button>
            </Button.Group>
          </Menu.Item>
        </Menu>
      </Resizable>
    );
  }
}

NoteMenu.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

NoteMenu.defaultProps = {
  user: {},
  notes: false,
  note: null,
  selectNote: false,
  createNote: false,
  userTags: null,
};

export default NoteMenu;
