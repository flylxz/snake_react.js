import React from 'react';
import './Box01.css';

class Box01 extends React.Component {
  render() {
    let setPositionY = this.props.movingBox.y;
    let setPositionX = this.props.movingBox.x;
    let top = setPositionY + 'px';
    let left = setPositionX + 'px';
    let boxSize = this.props.boxSize - 4;

    return (
      <div
        className='box-01'
        style={{ left: left, top: top, height: boxSize, width: boxSize }}
      ></div>
    );
  }
}

export default Box01;
