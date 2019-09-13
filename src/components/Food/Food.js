import React from 'react';
import './Food.css';

class Food extends React.Component {
  timeoutDestroy = 0;
  componentDidMount = () => {
    this.timeoutDestroy = setTimeout(
      this.destroy,
      this.props.timeDestroy * 1000
    );
  };

  componentWillUnmount = () => {
    clearTimeout(this.timeoutDestroy);
  };

  destroy = () => {
    this.props.destroy(this.props.food.id);
  };

  render() {
    let foodPosX = this.props.food.position.x;
    let foodPosY = this.props.food.position.y;
    let top = foodPosY + 'px';
    let left = foodPosX + 'px';
    let foodSize = this.props.foodSize - 4;

    return (
      <div
        className='food'
        style={{
          left: left,
          top: top,
          height: foodSize,
          width: foodSize
        }}
      ></div>
    );
  }
}

export default Food;
