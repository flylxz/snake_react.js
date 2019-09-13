import React from 'react';
import './Box02.css';

class Box02 extends React.Component {
  render() {
    let setPositionY = this.props.movingBox.y;
    let setPositionX = this.props.movingBox.x;
    let top = setPositionY + 'px';
    let left = setPositionX + 'px';
    let boxSize = this.props.boxSize - 4;

    return (
      <div
        className='box-02'
        style={{ left: left, top: top, height: boxSize, width: boxSize }}
      ></div>
    );
  }
}

export default Box02;
