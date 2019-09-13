import React from 'react';
import './Box.css';

class Box extends React.Component {
  render() {
    let setPositionY = this.props.movingBox.y;
    let setPositionX = this.props.movingBox.x;
    let top = setPositionY + 'px';
    let left = setPositionX + 'px';
    let boxSize = this.props.boxSize - 4;
    // console.log(this.props);

    return (
      <div
        className='box'
        style={{ left: left, top: top, height: boxSize, width: boxSize }}
      ></div>
    );
  }
}

export default Box;
