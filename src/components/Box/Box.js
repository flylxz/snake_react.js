import React from 'react';
import './Box.css';

class Box extends React.Component {
  render() {
    let setPositionY = this.props.movingBox.y;
    let setPositionX = this.props.movingBox.x;
    let bottom = setPositionY + 'px';
    let left = setPositionX + 'px';
    let boxSize = this.props.boxSize - 4;

    return (
      <div
        className='box'
        style={{ bottom: bottom, left: left, height: boxSize, width: boxSize }}
      ></div>
    );
  }
}

export default Box;
