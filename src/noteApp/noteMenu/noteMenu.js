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
      showFavorites: false,
      noteView: 'All',
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

    this.props.updateOrder(notes);
  }

  updateSearchValue = (value) => {
    this.setState({ searchValue: value });
  }

  matchNotes = () => {
    if (this.state.showFavorites) {
      return this.props.notes.filter(note => note.is_favorite);
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
              compact
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
                                  onClick={() => { this.props.selectNote(note.id); }}
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
            <Button.Group
              size="mini"
              widths="3"
              fluid
              basic
            >
              <Button
                onClick={() => { this.handleViewChange('All'); }}
                active={this.state.noteView === 'All'}
              >
                All
              </Button>
              <Button
                onClick={() => { this.handleViewChange('Tags'); }}
                active={this.state.noteView === 'Tags'}
              >
                Tags
              </Button>
              <Button
                onClick={() => { this.handleViewChange('Favorites'); }}
                active={this.state.noteView === 'Favorites'}
                icon
              >
                <Icon
                  color={this.state.noteView === 'Favorites' ? 'red' : 'grey'}
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
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
  copyNote: PropTypes.func,
  deleteNote: PropTypes.func,
  updateOrder: PropTypes.func,
  saveNote: PropTypes.func,
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

NoteMenu.defaultProps = {
  notes: false,
  note: null,
  selectNote: false,
  createNote: false,
  copyNote: false,
  deleteNote: false,
  updateOrder: false,
  saveNote: null,
  userTags: null,
};

export default NoteMenu;
