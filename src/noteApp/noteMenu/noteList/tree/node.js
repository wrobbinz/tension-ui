import React, { Component } from 'react';
import cx from 'classnames';
import { List, Icon } from 'semantic-ui-react';

class UITreeNode extends Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }

  renderCollapse = () => {
    const { index } = this.props;

    if (index.node.leaf) {
      return (
        <Icon
          name="sticky note outline"
          className="collapse note-icon"
        />
      );
    }

    const { collapsed } = index.node;

    return (
      <Icon
        name={collapsed ? 'folder' : 'folder open'}
        className="collapse note-icon"
      />
    );
  };

  renderChildren = () => {
    const {
      tree,
      index,
      dragging,
    } = this.props;

    if (index.children && index.children.length) {
      return (
        <div className={index.top === 1 ? null : 'children'}>
          {index.children.map((child) => {
            const childIndex = tree.getIndex(child);

            return (
              <UITreeNode
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  render() {
    const { tree, index, dragging } = this.props;
    const { node } = index;
    const styles = {};
    console.log(index);

    if (index.id === 1) {
      return this.renderChildren();
    }

    return (
      <div
        className={cx('m-node', {
          placeholder: index.id === dragging,
        })}
        style={styles}
        onMouseDown={e => e.stopPropagation()}
        onClick={this.handleCollapse}
      >
        <div
          className="inner"
          ref={this.innerRef}
          id={'node-' + index.id}
          onMouseDown={this.handleMouseDown}
        >
          {this.renderCollapse()}
          {tree.renderNode(node)}
        </div>
        {node.collapsed ? null : this.renderChildren()}
      </div>
    );
  }

  handleCollapse = e => {

    e.stopPropagation();

    const { index } = this.props;

    if (!index.node.leaf) {
      const { collapsed } = index.node;
      const nodeId = this.props.index.id;

      if (this.props.onCollapse) {
        this.props.onCollapse(nodeId);
      }
    }
  };

  handleMouseDown = e => {
    const nodeId = this.props.index.id;
    const dom = this.innerRef.current;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  };
}

export default UITreeNode;
