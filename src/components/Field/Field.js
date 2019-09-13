import React from 'react';
import './Field.css';
import Box from '../Box/Box';
import Food from '../Food/Food';
import Restart from '../Restart/Restart';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 2;
  static height = window.innerHeight;
  static width = window.innerWidth;
  static calcFieldHeight =
    Math.floor((Field.height - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;
  static calcFieldWidth =
    Math.floor((Field.width - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;

  intervalSnake = 0;
  intervalFood = 0;
  intervalFoodRemove = 0;

  state = {
    positionStack: {},
    vector: '',
    stateRestart: false,
    gamePaused: false,
    foodStack: {}
  };

  static randomizer = () => {
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

  static generateFood = () => {
    let timestamp = Date.now();
    let foodUnit = {};
    foodUnit.id = timestamp;
    foodUnit.position = Field.randomizer();
    return foodUnit;
  };

  foodQueue = () => {
    let newFood = Field.generateFood();
    let prevFood = this.state.foodStack;
    if (this.foodOnSnake(newFood, this.state.positionStack)) {
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
    this.initSnake();
    window.addEventListener('keydown', this.handleInput, true);
  };

  setStateRestart = stateRestart => {
    this.setState({
      stateRestart: stateRestart,
      foodStack: {}
    });
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
      vector: ''
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

    this.intervalSnake = setInterval(this.move, 1000);
    this.intervalFood = setInterval(this.foodQueue, 1000);
  };

  snakeFeed = (nextPosition, foodStack) => {
    const keysFood = Object.keys(foodStack);
    keysFood.forEach(key => {
      if (
        nextPosition.x === foodStack[key].position.x &&
        nextPosition.y === foodStack[key].position.y
      ) {
        this.snakeGrow();
        delete foodStack[key];
        this.setState({ foodStack: foodStack });
      }
    });
  };

  snakeGrow = () => {
    const positionStack = { ...this.state.positionStack };
    console.log('1->', positionStack);
    const countSnake = Object.keys(positionStack).length;
    console.log(countSnake);
    const end = positionStack[countSnake - 1];
    positionStack[countSnake] = { x: end.x, y: end.y };
    console.log('2->', positionStack);

    this.setState({ positionStack: positionStack });
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
      this.intervalSnake = setInterval(this.move, 1000);
      this.intervalFood = setInterval(this.foodQueue, 1000);
    } else {
      this.setState({ gamePaused: true });
      clearInterval(this.intervalSnake);
      clearInterval(this.intervalFood);
    }
  };

  gameOver = () => {
    clearInterval(this.intervalSnake);
    clearInterval(this.intervalFood);
    this.setState({ stateRestart: true });
  };

  changePosition = position => {
    const foodStack = { ...this.state.foodStack };
    this.snakeFeed(position, foodStack);
    const positionStack = { ...this.state.positionStack };

    if (this.selfCollision(position, positionStack));
    if (!this.borderCollision(position)) console.log();

    const countSnake = Object.keys(positionStack).length;

    for (let i = countSnake - 1; i >= 1; i--) {
      positionStack[i] = {};
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
    if (e.key === ' ') return this.gamePaused();
    this.setState({ vector: e.key });
  };

  move = () => {
    const head = this.state.positionStack[0];

    if (this.state.vector === 'ArrowUp') {
      this.changePosition({ x: head.x, y: head.y - Field._cell });
    }
    if (this.state.vector === 'ArrowDown') {
      this.changePosition({ x: head.x, y: head.y + Field._cell });
    }
    if (this.state.vector === 'ArrowLeft') {
      this.changePosition({ x: head.x - Field._cell, y: head.y });
    }
    if (this.state.vector === 'ArrowRight') {
      this.changePosition({ x: head.x + Field._cell, y: head.y });
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
        <div>{this.renderBoxes()}</div>
      </div>
    );
  };

  renderBoxes = () => {
    const boxes = this.state.positionStack;
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
