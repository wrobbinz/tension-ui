import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import './tags.css';


class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownClasses: 'no-border',
    };
  }

  handleAddition = (e, { value }) => {
    this.props.addUserTag(value);
  }

  handleChange = (e, { value }) => {
    this.props.updateNoteTags(value);
  }

  tagsValue() {
    if (this.props.note.tags) {
      return this.props.note.tags.map(tag => tag.value);
    }
    return null;
  }

  render() {
    return (
      <Dropdown
        className="tags-dropdown"
        options={this.props.userTags}
        placeholder={this.props.placeholder}
        value={this.tagsValue()}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
        search
        upward
        fluid
        selection
        multiple
        allowAdditions
        floating
      />
    );
  }
}

Tags.propTypes = {
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  addUserTag: PropTypes.func,
  updateNoteTags: PropTypes.func,
  placeholder: PropTypes.string,
};

Tags.defaultProps = {
  note: null,
  userTags: null,
  addUserTag: null,
  updateNoteTags: null,
  placeholder: null,
};

export default Tags;
