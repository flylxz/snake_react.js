import React from 'react';
import './Field.css';
import Box from '../Box/Box';
import Food from '../Food/Food';
import Restart from '../Restart/Restart';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 2;
  interval = 0;
  state = {
    positionStack: {},
    vector: '',
    stateRestart: false,
    foodStack: {}
  };

  static randomizer = () => {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 55)) + 20;
    const randomY = Math.floor(Math.random() * (window.innerHeight - 55)) + 20;
    return { x: randomX, y: randomY };
    // console.log(randomX, randomY);
  };

  static startPosition = (cellSize, count) => {
    const snake = {
      0: Field.randomizer()
    };
    for (let i = 1; i < count; i++) {
      const prev = snake[i - 1];
      const current = { x: prev.x, y: prev.y };
      snake[i] = current;
    }
    return snake;
  };

  componentDidMount = () => {
    this.initSnake();
    window.addEventListener('keydown', this.handleInput, true);
  };

  setStateRestart = stateRestart => {
    this.setState({ stateRestart: stateRestart });
    this.initSnake();
  };
  getRestart = () => {
    if (this.state.stateRestart)
      return <Restart setStateRestart={this.setStateRestart} />;
    return null;
  };

  initSnake = () => {
    this.setState({
      positionStack: Field.startPosition(Field._cell, Field.countSnake),
      vector: 'ArrowUp'
    });
    const dirCode = Math.floor(Math.random() * (5 - 1)) + 1;
    if (dirCode === 1) {
      this.setState({ vector: 'ArrowUp' });
    }
    if (dirCode === 2) {
      this.setState({ vector: 'ArrowDown' });
    }
    if (dirCode === 3) {
      this.setState({ vector: 'ArrowLeft' });
    }
    if (dirCode === 4) {
      this.setState({ vector: 'ArrowRight' });
    }

    this.interval = setInterval(this.move, 1000);
    this.foodPos();
  };

  foodPos = () => {
    const foodStack = {};
    for (let i = 0; i < 20; i++) {
      setInterval(() => {
        foodStack[i] = Field.randomizer();
        this.setState({ foodStack: foodStack });
      }, 1000);
    }
  };

  selfCollision = (position, snakePosition) => {
    let keysSnake = Object.keys(snakePosition);
    keysSnake.forEach(key => {
      if (
        position.x === snakePosition[key].x &&
        position.y === snakePosition[key].y
      )
        this.gameOver();
    });
  };

  borderCollision = position => {
    const topBorder = window.innerHeight - 10 - Field._cell * 2;
    const bottomBorder = 10;
    const leftBorder = 10 + Field._cell;
    const rightBorder = window.innerWidth - 10 - Field._cell * 2;
    if (
      position.x <= leftBorder ||
      position.x >= rightBorder ||
      position.y >= topBorder ||
      position.y <= bottomBorder
    )
      this.gameOver();
  };

  gameOver = () => {
    clearInterval(this.interval);
    this.setState({ stateRestart: true });
  };

  changePosition = position => {
    const positionStack = { ...this.state.positionStack };

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

  renderFood = () => {
    const food = this.state.foodStack;
    return Object.keys(food).map(id => {
      return <Food key={id} foodPos={food[id]} foodSize={Field._cell} />;
    });
  };

  render() {
    return (
      <div className='wrapper'>
        <div> {this.renderBoxes()}</div>
        {this.renderFood()}
        {this.getRestart()}
      </div>
    );
  }
}
export default Field;
