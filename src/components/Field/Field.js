import React from 'react';
import './Field.css';
import Box from '../Box/Box';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 50;
  interval = 0;
  state = {
    positionStack: Field.startPosition(Field._cell, Field.countSnake),
    vector: 'ArrowUp'
  };

  static startPosition = (cellSize, count) => {
    const snake = {
      0: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    };
    for (let i = 1; i < count; i++) {
      const prev = snake[i - 1];
      const current = { x: prev.x, y: prev.y - cellSize };
      snake[i] = current;
    }
    return snake;
  };

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleInput, true);
    this.interval = setInterval(this.move, 250);
    this.food();
  };

  // preventReverse = (prevPosition, currPosition) => {
  //   return (
  //     prevPosition.x !== currPosition.x || prevPosition.y !== currPosition.y
  //   );
  // };

  food = () => {
    // const foodPosX = Math.random(window.innerWidth - Field._cell) * 1000;
    // const foodPosY = Math.random(window.innerHeight - Field._cell) * 1000;
    // console.log(Math.round(foodPosX), Math.round(foodPosY));
    console.log(document.querySelector('#root > div'));
  };

  selfCollision = (position, snakePosition) => {
    let keysSnake = Object.keys(snakePosition);
    // for (let i = 0; i < Field.countSnake - 1; i++) {
    keysSnake.forEach(key => {
      if (
        position.x === snakePosition[key].x &&
        position.y === snakePosition[key].y
      )
        this.gameOver();
    });
  };

  borderCollision = position => {
    const topBorder = window.innerHeight - 20 - Field._cell * 2;
    const bottomBorder = 20;
    const leftBorder = 20 + Field._cell;
    const rightBorder = window.innerWidth - 20 - Field._cell * 2;
    if (
      position.x <= leftBorder ||
      position.x >= rightBorder ||
      position.y >= topBorder ||
      position.y <= bottomBorder
    )
      this.gameOver();
  };

  gameOver = () => {
    console.log('Game Over');
    clearInterval(this.interval);
  };

  changePosition = position => {
    const positionStack = { ...this.state.positionStack };

    // if (!this.preventReverse(position, positionStack[1])) return;
    if (this.selfCollision(position, positionStack));
    if (!this.borderCollision(position))
      for (let i = Field.countSnake - 1; i >= 1; i--) {
        const current = positionStack[i];
        const prev = positionStack[i - 1];
        current.x = prev.x;
        current.y = prev.y;
      }

    positionStack[0].x = position.x;
    positionStack[0].y = position.y;

    this.setState({ positionStack: positionStack });
  };

  handleInput = e => {
    if (e.key === 'ArrowUp' && this.state.vector === 'ArrowDown') return;
    if (e.key === 'ArrowDown' && this.state.vector === 'ArrowUp') return;
    if (e.key === 'ArrowLeft' && this.state.vector === 'ArrowRight') return;
    if (e.key === 'ArrowRight' && this.state.vector === 'ArrowLeft') return;
    this.setState({ vector: e.key });
  };

  move = () => {
    const head = this.state.positionStack[0];

    if (this.state.vector === 'ArrowUp') {
      this.changePosition({ x: head.x, y: head.y + Field._cell });
    }
    if (this.state.vector === 'ArrowDown') {
      this.changePosition({ x: head.x, y: head.y - Field._cell });
    }
    if (this.state.vector === 'ArrowLeft') {
      this.changePosition({ x: head.x - Field._cell, y: head.y });
    }
    if (this.state.vector === 'ArrowRight') {
      this.changePosition({ x: head.x + Field._cell, y: head.y });
    }
  };
  renderBoxes = () => {
    const boxes = this.state.positionStack;
    return Object.keys(boxes).map(id => {
      return <Box key={id} movingBox={boxes[id]} boxSize={Field._cell} />;
    });
  };

  render() {
    return <div className='wrapper'>{this.renderBoxes()}</div>;
  }
}
export default Field;
