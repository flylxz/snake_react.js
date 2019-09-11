import React from 'react';
import './Field.css';
import Box from '../Box/Box';
import Food from '../Food/Food';
import Restart from '../Restart/Restart';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 20;
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
  intervalRemoveFood = 0;

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
    let foodPosition = Field.randomizer();
    let timestamp = Date.now();
    let foodUnit = {};
    foodUnit.id = timestamp;
    foodUnit.position = foodPosition;
    return foodUnit;
  };

  foodQueue = () => {
    let newFood = Field.generateFood();
    if (this.foonOnSnake(newFood)) return null;
    if (this.foonOnFood(newFood)) return null;
    let prevFood = this.state.foodStack;
    let foodStack = Object.assign({}, newFood, prevFood);
    foodStack[newFood.id] = newFood;
    delete foodStack.id;
    delete foodStack.position;
    this.setState({ foodStack: foodStack });

    // console.log(newFood);
    // console.log(prevFood);
    // console.log(foodStack);
    // console.log(this.state.foodStack);
  };

  // foodRemove = food => {
  //   let foods = { ...this.state.foodStack };
  //   delete foods[food.id];
  // };

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
    // this.intervalRemoveFood = setInterval(this.foodRemove, 5000);
  };

  foonOnSnake = foodStack => {
    let keysSnake = Object.keys(this.state.positionStack);
    keysSnake.forEach(key => {
      if (
        foodStack.x !== this.state.positionStack[key].x &&
        foodStack.y !== this.state.positionStack[key].y
      );
    });
  };
  foonOnFood = foodStack => {
    let keysFood = Object.keys(this.state.foodStack);
    keysFood.forEach(key => {
      if (
        foodStack.x !== this.state.foodStack[key].x &&
        foodStack.y !== this.state.foodStack[key].y
      );
    });
  };

  // snakeGrow = (position, foodPosition) => {
  //   let keysFood = Object.keys(foodPosition);
  //   keysFood.forEach(key => {
  //     if (
  //       position.x === foodPosition[key].x &&
  //       position.y === foodPosition[key].y
  //     ) {
  //       console.log(this.state.foodStack);
  //       delete foodPosition[key];
  //       this.setState({ foodStack: foodPosition });
  //       console.log(this.state.foodStack);
  //       // Field.countSnake += 1;
  //     }
  //   });
  // };

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
    const positionStack = { ...this.state.positionStack };
    // const foodStack = { ...this.state.foodStack };

    if (this.selfCollision(position, positionStack));
    // if (this.snakeGrow(position, foodStack));
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
    // console.log(boxes);
    return Object.keys(boxes).map(id => {
      return <Box key={id} movingBox={boxes[id]} boxSize={Field._cell} />;
    });
  };

  renderFood = () => {
    const food = this.state.foodStack;
    // console.log(food);
    return Object.keys(food).map(id => {
      return (
        <Food key={id} foodPos={food[id].position} foodSize={Field._cell} />
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
