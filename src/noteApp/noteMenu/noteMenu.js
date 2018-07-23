import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import { Menu, Icon, Button } from 'semantic-ui-react';
import NoteSearch from './noteSearch/noteSearch';
import NoteList from './noteList/noteList';
import { resizeDirections } from './constants';
import './noteMenu.css';


class NoteMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      view: 'all',
    };
  }

  updateSearch = search => this.setState({ search });

  handleViewChange = view => this.setState({ view });

  addTreeLeaf = (note) => {
    const { tree } = this.props.user;
    const leaf = {
      noteId: note.id,
      leaf: true,
    };
    tree.children = [leaf, ...tree.children];
    this.props.updateUser({ tree });
  };

  addTreeFolder = () => {
    const { tree } = this.props.user;
    const folder = {
      module: 'New Folder',
      collapsed: true,
      children: [],
    };
    tree.children = [folder, ...tree.children];
    this.props.updateUser({ tree });
  }

  render() {
    const { user, notes } = this.props;
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
            <NoteSearch
              search={this.state.search}
              updateSearch={this.updateSearch}
              createNote={this.props.createNote}
              addTreeLeaf={this.addTreeLeaf}
            />
          </Menu.Item>
          <Menu.Item>
            <Button onClick={this.addTreeFolder}>
              + Add Folder
            </Button>
          </Menu.Item>
          <Menu.Item>
            <NoteList
              notes={notes}
              selectNote={this.props.selectNote}
              user={user}
              updateUser={this.props.updateUser}
            />
          </Menu.Item>
          <Menu.Item id="noteView">
            <Button.Group size="mini" widths="3" fluid basic>
              <Button
                onClick={() => { this.handleViewChange('all'); }}
                active={this.state.view === 'all'}
              >
                All
              </Button>
              <Button
                onClick={() => { this.handleViewChange('tags'); }}
                active={this.state.view === 'tags'}
              >
                Tags
              </Button>
              <Button
                onClick={() => { this.handleViewChange('favorites'); }}
                active={this.state.view === 'favorites'}
                icon
              >
                <Icon
                  color={this.state.view === 'favorites' ? 'red' : 'grey'}
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
  updateUser: PropTypes.func,
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
};

NoteMenu.defaultProps = {
  user: {},
  updateUser: null,
  notes: [],
  note: {},
  selectNote: null,
  createNote: null,
};

export default NoteMenu;
