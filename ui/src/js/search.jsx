import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'


class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleChange = (e, { value }) => {
    this.props.updateSearchTags(value)
  }

  render() {
    return (
      <Dropdown
        options={this.props.userTags}
        placeholder={this.props.placeholder}
        search
        selection
        multiple
        value={this.props.searchTags}
        onChange={this.handleChange}
      />
    )
  }
}

Search.propTypes = {
  searchTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  updateSearchTags: PropTypes.func,
  placeholder: PropTypes.string,
}

Search.defaultProps = {
  searchTags: null,
  userTags: null,
  updateSearchTags: null,
  placeholder: null,
}

export default Search
