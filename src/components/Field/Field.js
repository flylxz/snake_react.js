import React from 'react';
import './Field.css';
import Box from '../Box/Box';
import Food from '../Food/Food';
import Restart from '../Restart/Restart';
import Pause from '../Pause/Pause';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 3;
  static height = window.innerHeight;
  static width = window.innerWidth;
  static calcFieldHeight =
    Math.floor((Field.height - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;
  static calcFieldWidth =
    Math.floor((Field.width - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;

  intervalSnake01 = 0;
  intervalFood = 0;

  state = {
    positionStack01: {},
    vector01: '',
    stateRestart: false,
    gamePaused: false,
    foodStack: {}
  };

  static randomizerFood = () => {
    const randomX =
      Math.floor(
        Math.floor(Math.random() * Field.calcFieldWidth) / Field._cell
      ) * Field._cell;

    const randomY =
      Math.floor(
        Math.floor(Math.random() * Field.calcFieldHeight) / Field._cell
      ) * Field._cell;
    return { x: randomX, y: randomY };
  };

  static randomizerSnake = () => {
    const randomX =
      Math.floor(
        Math.floor(
          Math.random() * (Field.calcFieldWidth - Field._cell * 4) +
            Field._cell * 2
        ) / Field._cell
      ) * Field._cell;

    const randomY =
      Math.floor(
        Math.floor(
          Math.random() * (Field.calcFieldHeight - Field._cell * 4) +
            Field._cell * 2
        ) / Field._cell
      ) * Field._cell;
    return { x: randomX, y: randomY };
  };

  static startPosition01 = (cellSize, count) => {
    const snake01 = {
      0: Field.randomizerSnake()
    };
    for (let i = 1; i < count; i++) {
      const prev = snake01[i - 1];
      const current = { x: prev.x, y: prev.y };
      snake01[i] = current;
    }
    return snake01;
  };

  static generateFood = () => {
    let timestamp = Date.now();
    let foodUnit = {};
    foodUnit.id = timestamp;
    foodUnit.position = Field.randomizerFood();
    return foodUnit;
  };

  foodQueue = () => {
    let newFood = Field.generateFood();
    let prevFood = this.state.foodStack;
    if (this.foodOnSnake(newFood, this.state.positionStack01)) {
      newFood = Field.generateFood();
    }
    if (this.foodOnFood(newFood, prevFood)) {
      newFood = Field.generateFood();
    }
    let foodStack = Object.assign({}, prevFood);
    foodStack[newFood.id] = newFood;
    this.setState({ foodStack: foodStack });
  };

  componentDidMount = () => {
    this.initSnake01();
    this.intervalSnake01 = setInterval(this.move01, 500);
    this.intervalFood = setInterval(this.foodQueue, 1000);
    window.addEventListener('keydown', this.handleInput01, true);
  };

  setStateRestart = stateRestart => {
    this.setState({
      stateRestart: stateRestart,
      foodStack: {}
    });
    this.initSnake01();
  };

  getRestart = () => {
    if (this.state.stateRestart)
      return <Restart setStateRestart={this.setStateRestart} />;
    return null;
  };

  initSnake01 = () => {
    this.setState({
      positionStack01: Field.startPosition01(Field._cell, Field.countSnake),
      vector01: ''
    });
    const dirCode = Math.floor(Math.random() * (5 - 1)) + 1;
    if (dirCode === 1) {
      this.setState({ vector01: 'ArrowUp' });
    }
    if (dirCode === 2) {
      this.setState({ vector01: 'ArrowDown' });
    }
    if (dirCode === 3) {
      this.setState({ vector01: 'ArrowLeft' });
    }
    if (dirCode === 4) {
      this.setState({ vector01: 'ArrowRight' });
    }
  };

  snakeFeed01 = (nextPosition, foodStack) => {
    const keysFood = Object.keys(foodStack);
    keysFood.forEach(key => {
      if (
        nextPosition.x === foodStack[key].position.x &&
        nextPosition.y === foodStack[key].position.y
      ) {
        this.snakeGrow01();
        delete foodStack[key];
        this.setState({ foodStack: foodStack });
      }
    });
  };

  snakeGrow01 = () => {
    const positionStack = { ...this.state.positionStack01 };
    const countSnake = Object.keys(positionStack).length;
    const end = positionStack[countSnake - 1];
    positionStack[countSnake] = { x: end.x, y: end.y };
    this.setState({ positionStack01: positionStack });
  };

  foodOnSnake = (newFood, snakePosition) => {
    let keysSnake = Object.keys(snakePosition);
    keysSnake.forEach(key => {
      if (
        newFood.position.x === snakePosition[key].x &&
        newFood.position.y === snakePosition[key].y
      )
        return;
    });
  };

  foodOnFood = (newFood, foodPosition) => {
    let keysFood = Object.keys(foodPosition);
    keysFood.forEach(key => {
      if (
        newFood.position.x === foodPosition[key].position.x &&
        newFood.position.y === foodPosition[key].position.y
      )
        return;
    });
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
    const topBorder = -Field._cell;
    const bottomBorder = Field.calcFieldHeight;
    const leftBorder = -Field._cell;
    const rightBorder = Field.calcFieldWidth;
    if (
      position.x <= leftBorder ||
      position.x >= rightBorder ||
      position.y <= topBorder ||
      position.y >= bottomBorder
    )
      this.gameOver();
  };

  gamePaused = () => {
    if (this.state.gamePaused) {
      this.setState({ gamePaused: false });
      this.intervalSnake01 = setInterval(this.move01, 500);
      this.intervalFood = setInterval(this.foodQueue, 1000);
    } else {
      this.setState({ gamePaused: true });
      clearInterval(this.intervalSnake01);
      clearInterval(this.intervalFood);
    }
  };

  gameOver = () => {
    clearInterval(this.intervalSnake01);
    clearInterval(this.intervalFood);
    this.setState({ stateRestart: true });
  };

  changePosition01 = position01 => {
    const foodStack = { ...this.state.foodStack };
    this.snakeFeed01(position01, foodStack);
    const positionStack01 = { ...this.state.positionStack01 };
    if (this.selfCollision(position01, positionStack01));
    if (!this.borderCollision(position01));
    const countSnake01 = Object.keys(positionStack01).length;
    for (let i = countSnake01 - 1; i >= 1; i--) {
      positionStack01[i] = {};
      const current01 = positionStack01[i];
      const prev01 = positionStack01[i - 1];
      current01.x = prev01.x;
      current01.y = prev01.y;
    }
    positionStack01[0].x = position01.x;
    positionStack01[0].y = position01.y;
    this.setState({ positionStack01: positionStack01 });
  };

  handleInput01 = e => {
    if (e.key === 'ArrowUp' && this.state.vector01 === 'ArrowDown') return;
    if (e.key === 'ArrowDown' && this.state.vector01 === 'ArrowUp') return;
    if (e.key === 'ArrowLeft' && this.state.vector01 === 'ArrowRight') return;
    if (e.key === 'ArrowRight' && this.state.vector01 === 'ArrowLeft') return;
    if (e.key === ' ') return this.gamePaused();
    this.setState({ vector01: e.key });
    console.log(e.key);
  };

  move01 = () => {
    const head01 = this.state.positionStack01[0];

    if (this.state.vector01 === 'ArrowUp') {
      this.changePosition01({ x: head01.x, y: head01.y - Field._cell });
    }
    if (this.state.vector01 === 'ArrowDown') {
      this.changePosition01({ x: head01.x, y: head01.y + Field._cell });
    }
    if (this.state.vector01 === 'ArrowLeft') {
      this.changePosition01({ x: head01.x - Field._cell, y: head01.y });
    }
    if (this.state.vector01 === 'ArrowRight') {
      this.changePosition01({ x: head01.x + Field._cell, y: head01.y });
    }
  };

  renderField = () => {
    return (
      <div
        className='wrapper'
        style={{
          width: Field.calcFieldWidth,
          height: Field.calcFieldHeight
        }}
      >
        <div>{this.renderFood()}</div>
        <div>{this.renderBoxes01()}</div>
      </div>
    );
  };

  renderBoxes01 = () => {
    const boxes = this.state.positionStack01;
    return Object.keys(boxes).map(id => {
      return <Box key={id} movingBox={boxes[id]} boxSize={Field._cell} />;
    });
  };

  destroy = id => {
    const foodStack = { ...this.state.foodStack };
    delete foodStack[id];
    this.setState({ foodStack: foodStack });
  };

  renderFood = () => {
    const food = this.state.foodStack;
    return Object.keys(food).map(id => {
      return (
        <Food
          key={id}
          food={food[id]}
          destroy={this.destroy}
          timeDestroy={20}
          foodSize={Field._cell}
        />
      );
    });
  };

  render() {
    return (
      <div>
        {this.renderField()}
        {this.getRestart()}
      </div>
    );
  }
}
export default Field;
