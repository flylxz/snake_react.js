import React from 'react';
import './Food.css';

class Food extends React.Component {
  render() {
    let foodPosX = this.props.foodPos.x;
    let foodPosY = this.props.foodPos.y;
    let top = foodPosY + 'px';
    let left = foodPosX + 'px';
    let foodSize = this.props.foodSize - 4;

    return (
      <div
        className='food'
        style={{
          top: top,
          left: left,
          height: foodSize,
          width: foodSize
        }}
      ></div>
    );
  }
}

export default Food;
