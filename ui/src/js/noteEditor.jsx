import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'
// import marked from 'marked'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/edit/continuelist'
import 'hypermd/mode/hypermd'
// import './hypermd/addon/hide-token'
// import './hypermd/addon/cursor-debounce'
// import './hypermd/addon/fold'
// import './hypermd/addon/fold-math'
// import './hypermd/addon/readlink'
// import './hypermd/addon/click'
// import './hypermd/addon/hover'
// import './hypermd/addon/paste'
// import './hypermd/addon/paste-image'
// import '../css/theme.css'


class NoteEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  handleChange = (event) => {
    const markdown = event.target.value
    this.setState({ markdown })
    this.props.updateContents(markdown)
  }

  render() {
    return (
      <div className="editor float-left">
        <Input
          id="titleInput"
          className="no-border full-width"
          size="big"
          placeholder="Title"
          value={this.props.note ? this.props.note.title : ''}
          maxLength="20"
          onChange={this.props.updateTitle}
        />
        <CodeMirror
          className="full-height"
          options={{
            mode: 'text/x-hypermd',
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
              Enter: 'newlineAndIndentContinueMarkdownList',
            },
            theme: 'theme',
            hmdHideToken: '(profile-1)',
          }}
          value={this.state.value}
          // options={}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value })
          }}
          onChange={(editor, value) => {
            console.log('controlled', { value })
          }}
        />
        {/* <Form className="full-height">
          <TextArea
            id="editor"
            className="no-border-radius no-border"
            value={this.props.note.contents}
            onChange={this.handleChange}
            placeholder="_"
            style={{ minHeight: '100%' }}
          />
        </Form> */}
      </div>
    )
  }
}

NoteEditor.propTypes = {
  updateTitle: PropTypes.func,
  updateContents: PropTypes.func,
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

NoteEditor.defaultProps = {
  updateTitle: false,
  updateContents: false,
  note: false,
}

export default NoteEditor
