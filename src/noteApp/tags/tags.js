import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'semantic-ui-react';
import './tags.css';


class Tags extends Component {
  static propTypes = {
    note: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    updateNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getOptions = tags => tags.map(tag => ({ key: tag, text: tag, value: tag }));

  handleChange = (e, data) => {
    const tags = data.value;
    this.props.updateNote({ tags });
  }

  render() {
    const { note, tags } = this.props;
    return (
      <Menu secondary className="no-margin">
        <Menu.Item className="full-width">
          <Dropdown
            className="tags-dropdown"
            options={this.getOptions(tags)}
            value={note.tags}
            onChange={this.handleChange}
            placeholder="# Tags"
            allowAdditions
            selection
            multiple
            floating
            search
            upward
            fluid
          />
        </Menu.Item>
      </Menu>
    );
  }
}

export default Tags;
