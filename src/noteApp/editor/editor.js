import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Prism from 'prismjs';
import EditList from 'slate-edit-list';
import extendMarkdown from './plugin/markdown';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlight,
  Code,
  Hr,
  Blockquote,
  Header,
  OrderedList,
  UnorderedList,
  ListItem,
  Punctuation,
  CheckListItem,
  Url,
} from './plugin/components';
import initialValue from './plugin/value.json';
import './editor.css';


extendMarkdown();
const editListPlugin = EditList();
const plugins = [
  editListPlugin,
];


class NoteEditor extends Component {
  static propTypes = {
    note: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    updateNote: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: Value.fromJSON(initialValue),
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  }

  onKeyDown = (event, change) => {
    switch (event.key) {
      case ' ':
        return this.onSpace(event, change);
      case 'Backspace':
        return this.onBackspace(event, change);
      case 'Enter':
        return this.onEnter(event, change);
      case 'Tab':
        return this.onTab(event, change);
      default:
        return null;
    }
  }

  onTab = (event, change) => {
    const { increaseItemDepth } = editListPlugin.changes;
    const { value } = change;
    const { selection } = value;
    if (selection.isExpanded) return;
    const { startBlock } = value;
    const { start } = selection;
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '');
    const type = this.getType(chars);

    if (!type) return;
    event.preventDefault();
    if (type === 'list-item' && startBlock.type === 'list-item') {
      this.call(increaseItemDepth);
    }
    return true;
  }

  onSpace = (event, change) => {
    const { wrapInList } = editListPlugin.changes;
    const { value } = change;
    const { selection } = value;
    if (selection.isExpanded) return;

    const { startBlock } = value;
    const { start } = selection;
    const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '');
    const type = this.getType(chars);

    if (!type) return;
    if (type === 'list-item' && startBlock.type === 'list-item') return;
    if (type === 'ordered-list-item' && startBlock.type === 'ordered-list-item') return;

    event.preventDefault();

    change.setBlocks(type);

    if (type === 'list-item') {
      this.call(wrapInList);
    }

    if (type === 'ordered-list-item') {
      this.call(wrapInList);
    }

    change.moveFocusToStartOfNode(startBlock).delete();
    return true;
  }

  onBackspace = (event, change) => {
    const { unwrapList } = editListPlugin.changes;
    const { value } = change;
    const { selection } = value;
    if (selection.isExpanded) return;
    if (selection.start.offset !== 0) return;

    const { startBlock } = value;
    if (startBlock.type === 'paragraph') return;

    event.preventDefault();
    /* handle checklist */
    if (
      event.key === 'Backspace' &&
      selection.isCollapsed &&
      value.startBlock.type === 'check-list-item' &&
      selection.start.offset === 0
    ) {
      change.setBlocks('paragraph');
      return true;
    }

    if (startBlock.type === 'list-item' || startBlock.type === 'ordered-list-item') {
      // change.deleteBackward(1);
      change.setBlocks('paragraph');
    } else {
      change.setBlocks('paragraph');
    }

    return true;
  }

  onEnter = (event, change) => {
    const { value } = change;
    const { selection } = value;
    const { start, end, isExpanded } = selection;
    if (isExpanded) return;

    if (value.startBlock.type === 'check-list-item') {
      change.splitBlock().setBlocks({ data: { checked: false } });
      return true;
    }

    const { startBlock } = value;
    if (start.offset === 0 && startBlock.text.length === 0) {
      change.setBlocks('paragraph');
      return this.onBackspace(event, change);
    }
    if (end.offset !== startBlock.text.length) return;

    const blockTypes = [
      'ul_list',
      'heading-one',
      'heading-two',
      'heading-three',
      'heading-four',
      'heading-five',
      'heading-six',
      'block-quote',
    ];

    if (!blockTypes.includes(startBlock.type)) return;

    event.preventDefault();
    change.splitBlock().setBlocks('paragraph');
    return true;
  }

  getType = (chars) => {
    switch (chars) {
      case '-':
        return 'check-list-item';
      case '*':
      case '+':
        return 'list-item';
      case '1.':
      case '1)':
        return 'ordered-list-item';
      case '>':
        return 'block-quote';
      case '#':
        return 'heading-one';
      case '##':
        return 'heading-two';
      case '###':
        return 'heading-three';
      case '####':
        return 'heading-four';
      case '#####':
        return 'heading-five';
      case '######':
        return 'heading-six';
      default:
        return null;
    }
  }

  call(change) {
    this.setState({
      value: this.state.value.change().call(change).value
    });
  }

  lockNote = (locked) => {
    console.log('Lock Note.', locked);
  }

  handleChange = () => {
    if (this.props.note.id !== this.state.noteId) {
      this.setState({ noteId: this.props.note.id });
      return;
    }
    const content = this.quillRef.getContents();
    this.props.updateNote({ content }, true);
  }

  decorateNode = (node) => {
    if (node.object !== 'block') return;

    const string = node.text;
    const texts = node.getTexts().toArray();
    const grammar = Prism.languages.markdown;
    const tokens = Prism.tokenize(string, grammar);
    const decorations = [];
    let startText = texts.shift();
    let endText = startText;
    let startOffset = 0;
    let endOffset = 0;
    let start = 0;

    function getLength(token) {
      if (typeof token === 'string') {
        return token.length;
      } else if (typeof token.content === 'string') {
        return token.content.length;
      }
      return token.content.reduce((l, t) => l + getLength(t), 0);
    }

    tokens.forEach((token) => {
      startText = endText;
      startOffset = endOffset;

      const length = getLength(token);
      const end = start + length;

      let available = startText.text.length - startOffset;
      let remaining = length;

      endOffset = startOffset + remaining;

      while (available < remaining) {
        endText = texts.shift();
        remaining = length - available;
        available = endText.text.length;
        endOffset = remaining;
      }

      if (typeof token !== 'string') {
        const range = {
          anchor: {
            key: startText.key,
            offset: startOffset,
          },
          focus: {
            key: endText.key,
            offset: endOffset,
          },
          marks: [{ type: token.type }],
        };

        decorations.push(range);
      }

      start = end;
    });

    return decorations;
  }

  onInputChange = (event) => {
    const { value } = this.state;
    const string = event.target.value;
    const texts = value.document.getTexts();
    const decorations = [];

    texts.forEach((node) => {
      const { key, text } = node;
      const parts = text.split(string);
      let offset = 0;

      parts.forEach((part, i) => {
        if (i !== 0) {
          decorations.push({
            anchor: { key, offset: offset - string.length },
            focus: { key, offset },
            marks: [{ type: 'highlight' }],
            isAtomic: true,
          });
        }

        offset = offset + part.length + string.length;
      });
    });

    // Setting the `save` option to false prevents this change from being added
    // to the undo/redo stack and clearing the redo stack if the user has undone
    // changes.
    const change = value
      .change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true);

    this.onChange(change);
  }

  renderMark = (props) => {
    switch (props.mark.type) {
      case 'bold':
        return <Bold {...props} />;
      case 'code':
        return <Code {...props} />;
      case 'italic':
        return <Italic {...props} />;
      case 'underline':
        return <Underline {...props} />;
      case 'strikethrough':
        return <Strikethrough {...props} />;
      case 'highlight':
        return <Highlight {...props} />;
      case 'hr':
        return <Hr {...props} />;
      case 'punctuation':
        return <Punctuation {...props} />;
      case 'url':
        return <Url {...props} />;
      default:
        return null;
    }
  }

  renderNode = (props) => {
    switch (props.node.type) {
      case 'block-quote':
        return <Blockquote {...props} />;
      case 'check-list-item':
        return <CheckListItem {...props} />;
      case 'ul_list':
        return <UnorderedList {...props} />;
      case 'ol_list':
        return <OrderedList {...props} />;
      case 'heading-one':
        return <Header {...props} level={1} />;
      case 'heading-two':
        return <Header {...props} level={2} />;
      case 'heading-three':
        return <Header {...props} level={3} />;
      case 'heading-four':
        return <Header {...props} level={4} />;
      case 'heading-five':
        return <Header {...props} level={5} />;
      case 'heading-six':
        return <Header {...props} level={6} />;
      case 'list-item':
        return <ListItem {...props} />;
      case 'ordered-list-item':
        return <ListItem {...props} />;
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>;
      default:
        return null;
    }
  }

  render() {
    return (
      <Editor
        className="note-editor flex-grow"
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        decorateNode={this.decorateNode}
        plugins={plugins}
      />
    );
  }
}

export default NoteEditor;
