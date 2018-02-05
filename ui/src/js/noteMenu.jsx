import React, { Component } from 'react'
import { Popup, Icon } from 'semantic-ui-react'


class NoteMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Popup
        trigger={<Icon name="ellipsis horizontal" link />}
        content={
          <div>
            <Icon
              name="copy"
              link
            />
            <Icon
              name="share alternate"
              link
            />
            <Icon
              name="trash outline"
              link
            />
          </div>
        }
        on="click"
        position="right center"
      />
    )
  }
}

export default NoteMenu
