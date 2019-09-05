import React from 'react';
import './Food.css';

class Food extends React.Component {
  render() {
    // let foodPosX = 134;
    // let foodPosY = 555;
    let foodPosX = this.props.foodPos.x;
    let foodPosY = this.props.foodPos.y;
    // console.log(this.props);
    let bottom = foodPosY + 'px';
    let left = foodPosX + 'px';
    let foodSize = this.props.foodSize - 4;

    return (
      <div
        className='food'
        style={{
          bottom: bottom,
          left: left,
          height: foodSize,
          width: foodSize
        }}
      ></div>
    );
  }
}

export default Food;
