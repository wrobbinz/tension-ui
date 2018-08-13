import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';
import './NoteViewOptions.css';


class NoteViewOptions extends Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    changeView: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleViewChange = (view) => {
    this.props.changeView(view);
  }

  render() {
    const { view } = this.props;
    return (
      <Button.Group size="tiny" widths="3" fluid basic>
        <Button
          onClick={() => { this.handleViewChange('all'); }}
          active={view === 'all'}
        >
          <Icon
            color="grey"
            name={view === 'all' ? 'folder' : 'folder outline'}
          />
        </Button>
        <Button
          onClick={() => { this.handleViewChange('tag'); }}
          active={view === 'tag'}
        >
          <Icon
            color={view === 'tag' ? 'blue' : 'grey'}
            name="tag"
          />
        </Button>
        <Button
          onClick={() => { this.handleViewChange('fav'); }}
          active={view === 'fav'}
          icon
        >
          <Icon
            color={view === 'fav' ? 'red' : 'grey'}
            name="heart"
          />
        </Button>
      </Button.Group>
    );
  }
}

export default NoteViewOptions;
