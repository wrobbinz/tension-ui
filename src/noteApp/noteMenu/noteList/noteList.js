import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { List } from 'semantic-ui-react';
import Tree from './tree/react-ui-tree';
import './noteList.css';
import tree from './exTree';


class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: tree,
    };
  }

  onClickNode = (node) => {
    this.active = node;
  }

  handleChange = (tree) => {
    this.setState({ tree });
  }

  matchNotes = () => {
    if (this.state.view === 'favorites') {
      return this.props.notes.filter(note => note.favorite);
    }
    if (this.state.search) {
      const search = this.state.search.toLowerCase();
      return this.props.notes.filter((note) => {
        const matchedTags = note.tags.map(tag => tag.toLowerCase()).includes(search);
        const matchedTitle = note.title.toLowerCase().includes(search);
        return matchedTags || matchedTitle;
      });
    }
    return this.props.notes;
  }

  noteById = id => this.props.notes.find(note => note.id === id)

  listItems = items => items.map(item => (
    item.folder ?
      (
        <List.Item onClick={this.handleFolderClick} key={item.name} value={item}>
          <List.Icon
            className="note-icon"
            name="slack hash"
            flipped="vertically"
          />
          <List.Content>
            <List.Header>
              {item.name}
            </List.Header>
            {
              item.open ?
                <List.List>
                  {this.listItems(item.children)}
                </List.List>
                : null
            }
          </List.Content>
        </List.Item>
      ) :
      (
        <List.Item
          onClick={this.handleFileClick}
          className="note-list-item truncate"
          name={item.toString()}
          key={item}
          value={this.noteById(item)}
        >
          <List.Icon
            className="note-icon"
            name="sticky note outline"
          />
          <List.Content>
            <List.Header>note</List.Header>
          </List.Content>
        </List.Item>
      )
  ));

  renderNode = node => (
    <List.Item
      className={cx('node', {
        'is-active': node === this.active,
        'tree-leaf': true,
      })}
      onClick={this.onClickNode}
    >
      {node.module}
    </List.Item>
  )

  render() {
    const { list } = this.state;
    return (
      <List>
        <Tree
          paddingLeft={20}
          onChange={this.handleChange}
          tree={this.state.tree}
          renderNode={this.renderNode}
        />
      </List>
      // <List size="small">
      //   { this.listItems(list) }
      // </List>


      // <DragDropContext onDragEnd={this.onDragEnd}>
      //   <Droppable droppableId="droppable">
      //     {provided => (
      //       <div
      //         className="note-list"
      //         ref={provided.innerRef}
      //       >
      //         {this.matchNotes().map((note, index) => (
      //           <Draggable key={note.id} draggableId={note.id} index={index}>
      //             {prov => (
      //               <div>
      //                 <div
      //                   ref={prov.innerRef}
      //                   {...prov.draggableProps}
      //                   {...prov.dragHandleProps}
      //                 >
      //                   <List.Item
      //                     className="note-list-item truncate"
      //                     note={note}
      //                     onClick={this.handleSelect}
      //                     name={note.id.toString()}
      //                     active={this.props.note.id === note.id}
      //                     id={note.id}
      //                   >
      //                     <List.Icon
      //                       className="note-icon"
      //                       name={this.props.note.id === note.id ? 'sticky note' : 'sticky note outline'}
      //                     />
      //                     <List.Description>
      //                       {note.title === '' ? 'Untitled Note' : note.title}
      //                     </List.Description>
      //                   </List.Item>
      //                 </div>
      //                 {prov.placeholder}
      //               </div>
      //             )}
      //           </Draggable>
      //         ))}
      //         {provided.placeholder}
      //       </div>
      //     )}
      //   </Droppable>
      // </DragDropContext>
    );
  }
}

NoteList.propTypes = {
  notes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  note: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  selectNote: PropTypes.func,
};

NoteList.defaultProps = {
  notes: [],
  note: null,
  selectNote: null,
};

export default NoteList;
