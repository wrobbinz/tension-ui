/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Icon, Checkbox, List } from 'semantic-ui-react';
import './components.css';


const headerIcon = (
  <Icon
    name="heading"
    size="mini"
    color="grey"
    className="header-icon"
  />
);

export function Header({ attributes, children, level }) {
  const Tag = `h${level}`; // h1, h2, h3...
  return (
    <Tag {...attributes}>
      {headerIcon}
      {children}
    </Tag>
  );
}

export function Url({ attributes, children }) {
  return (
    <a {...attributes}>
      {children}
    </a>
  );
}

export function Bold({ attributes, children }) {
  return (
    <strong {...attributes}>
      {children}
    </strong>
  );
}

export function Italic({ attributes, children }) {
  return (
    <em {...attributes}>
      {children}
    </em>
  );
}

export function Underline({ attributes, children }) {
  return (
    <u {...attributes}>
      {children}
    </u>
  );
}

export function Strikethrough({ attributes, children }) {
  return (
    <span {...attributes} className="strikethrough">
      {children}
    </span>
  );
}

export function Highlight({ attributes, children }) {
  return (
    <span {...attributes} className="highlight">
      {children}
    </span>
  );
}

export function Code({ attributes, children }) {
  return (
    <code {...attributes}>
      {children}
    </code>
  );
}

export function Hr({ attributes, children }) {
  return (
    <span
      {...attributes}
      className="hr"
    >
      {children}
    </span>
  );
}

export function Blockquote({ attributes, children }) {
  return (
    <blockquote {...attributes}>
      {children}
    </blockquote>
  );
}

export function UnorderedList({ attributes, children }) {
  return (
    <List as="ul" {...attributes}>
      {children}
    </List>
  );
}

export function OrderedList({ attributes, children }) {
  return (
    <List as="ol" {...attributes}>
      {children}
    </List>
  );
}

export function ListItem({ attributes, children }) {
  return (
    <List.Item as="li" {...attributes}>
      {children}
    </List.Item>
  );
}

export function Punctuation({ attributes, children }) {
  return (
    <span {...attributes} className="punctuation">
      {children}
    </span>
  );
}

function ItemWrapper({ attributes, children }) {
  return (
    <div {...attributes} className="checklist-item-wrapper">
      {children}
    </div>
  );
}

function CheckboxWrapper({ attributes, children }) {
  return (
    <span {...attributes} className="checkbox-wrapper">
      {children}
    </span>
  );
}

function ContentWrapper({ attributes, children, checked }) {
  return (
    <span
      {...attributes}
      className="checklist-content-wrapper"
      style={{
        opacity: () => (checked ? 0.666 : 1),
        textDecoration: () => (checked ? 'none' : 'line-through'),
      }}
    >
      {children}
    </span>
  );
}

export class CheckListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (event) => {
    const { checked } = event.target;
    const { editor, node } = this.props;
    editor.change(c => c.setNodeByKey(node.key, { data: { checked } }));
  }


  render() {
    const {
      attributes,
      children,
      node,
      readOnly,
    } = this.props;
    const checked = node.data.get('checked');
    return (
      <ItemWrapper {...attributes}>
        <CheckboxWrapper {...attributes} contentEditable={false}>
          <Checkbox {...attributes} type="checkbox" checked={checked} onChange={this.onChange} />
        </CheckboxWrapper>
        <ContentWrapper
          {...attributes}
          checked={checked}
          contentEditable={!readOnly}
          suppressContentEditableWarning
        >
          {children}
        </ContentWrapper>
      </ItemWrapper>
    );
  }
}
