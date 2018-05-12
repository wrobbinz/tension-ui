import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'


class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleChange = (e, { value }) => {
    this.props.updateSearchValue(value)
  }

  render() {
    return (
      <Input
        placeholder={this.props.placeholder}
        value={this.props.searchValue}
        onChange={this.handleChange}
        icon="search"
      />
    )
  }
}

Search.propTypes = {
  searchTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  userTags: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  updateSearchValue: PropTypes.func,
  placeholder: PropTypes.string,
}

Search.defaultProps = {
  searchTags: null,
  userTags: null,
  updateSearchValue: null,
  placeholder: null,
}

export default Search
