import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import { Menu, Icon, Button } from 'semantic-ui-react';
import Search from './noteSearch/noteSearch';
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

  render() {
    const { notes } = this.props;
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
              search={this.state.search}
              updateSearch={this.updateSearch}
              createNote={this.props.createNote}
            />
          </Menu.Item>
          <Menu.Item>
            <NoteList
              notes={notes}
              selectNote={this.props.selectNote}
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
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
};

NoteMenu.defaultProps = {
  user: {},
  notes: null,
  note: null,
  selectNote: null,
  createNote: null,
};

export default NoteMenu;
