import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import { Menu } from 'semantic-ui-react';
import NoteSearch from './noteSearch/noteSearch';
import NoteSearchView from './NoteSearchView/NoteSearchView';
import NoteTreeView from './NoteTreeView/NoteTreeView';
import NoteTreeActions from './NoteTreeView/NoteTreeActions/NoteTreeActions';
import NoteTagView from './NoteTagView/NoteTagView';
import NoteFavView from './NoteFavView/NoteFavView';
import NoteViewOptions from './NoteViewOptions/NoteViewOptions';
import { resizeDirections } from './constants';
import './noteMenu.css';


class NoteMenu extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    updateUser: PropTypes.func.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    addTreeLeaf: PropTypes.func.isRequired,
    selectNote: PropTypes.func.isRequired,
    createNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      view: 'all',
    };
  }

  updateSearch = search => this.setState({ search })

  handleViewChange = view => this.setState({ view });

  changeView = (view) => {
    this.setState({ view });
  }

  renderNoteView = (view) => {
    const { search } = this.state;
    const { notes, user } = this.props;
    if (search) {
      return (
        <NoteSearchView
          search={search}
          notes={notes}
          selectNote={this.props.selectNote}
        />
      );
    }

    switch (view) {
      case 'all':
        return (
          <NoteTreeView
            notes={notes}
            selectNote={this.props.selectNote}
            tree={user.tree}
            updateUser={this.props.updateUser}
          />
        );
      case 'tag':
        return (
          <NoteTagView
            notes={notes}
            selectNote={this.props.selectNote}
          />
        );
      case 'fav':
        return (
          <NoteFavView
            notes={notes}
            selectNote={this.props.selectNote}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { search, view } = this.state;
    const { user } = this.props;

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
          <Menu.Item className="full-width">
            <NoteSearch
              search={search}
              updateSearch={this.updateSearch}
              createNote={this.props.createNote}
              addTreeLeaf={this.props.addTreeLeaf}
            />
          </Menu.Item>
          {
            view === 'all' ? (
              <Menu.Item className="full-width">
                <NoteTreeActions
                  user={user}
                  updateUser={this.props.updateUser}
                />
              </Menu.Item>
            ) : null
          }
          <Menu.Item className="note-view">
            {this.renderNoteView(view)}
          </Menu.Item>
          <Menu.Item className="full-width">
            <NoteViewOptions view={view} changeView={this.changeView} />
          </Menu.Item>
        </Menu>
      </Resizable>
    );
  }
}

export default NoteMenu;
