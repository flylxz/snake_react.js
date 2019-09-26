import React from 'react';
import './Field.css';
import Box01 from '../Box01/Box01';
import Box02 from '../Box02/Box02';
import Food from '../Food/Food';
import Restart from '../Restart/Restart';
import Pause from '../Pause/Pause';

class Field extends React.Component {
  static _cell = 15;
  static countSnake = 4;
  static height = window.innerHeight;
  static width = window.innerWidth;
  static calcFieldHeight =
    Math.floor((Field.height - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;
  static calcFieldWidth =
    Math.floor((Field.width - Field._cell * 2) / Field._cell) * Field._cell -
    Field._cell;

  intervalSnake01 = 0;
  intervalSnake02 = 0;
  intervalFood = 0;

  state = {
    positionStack01: {},
    positionStack02: {},
    vector01: '',
    vector02: '',
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

  static startPosition02 = (cellSize, count) => {
    const snake02 = {
      0: Field.randomizerSnake()
    };
    for (let i = 1; i < count; i++) {
      const prev = snake02[i - 1];
      const current = { x: prev.x, y: prev.y };
      snake02[i] = current;
    }
    return snake02;
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
    if (this.foodOnSnake01(newFood, this.state.positionStack01)) {
      newFood = Field.generateFood();
      if (this.foodOnSnake01(newFood, this.state.positionStack01)) return null;
    }
    if (this.foodOnSnake02(newFood, this.state.positionStack02)) {
      newFood = Field.generateFood();
      if (this.foodOnSnake02(newFood, this.state.positionStack02)) return null;
    }
    if (this.foodOnFood(newFood, prevFood)) {
      newFood = Field.generateFood();
      if (this.foodOnFood(newFood, prevFood)) return null;
    }
    let foodStack = Object.assign({}, prevFood);
    foodStack[newFood.id] = newFood;
    this.setState({ foodStack: foodStack });
  };

  componentDidMount = () => {
    this.initSnake01();
    this.initSnake02();

    window.addEventListener('keydown', this.handleInput01, true);
    window.addEventListener('keydown', this.handleInput02, true);
  };

  setStateRestart = stateRestart => {
    this.setState({
      stateRestart: stateRestart,
      foodStack: {}
    });
    this.initSnake01();
    this.initSnake02();
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

    this.intervalSnake01 = setInterval(this.move01, 500);
    this.intervalFood = setInterval(this.foodQueue, 1000);
  };

  initSnake02 = () => {
    this.setState({
      positionStack02: Field.startPosition02(Field._cell, Field.countSnake),
      vector02: ''
    });
    const dirCode = Math.floor(Math.random() * (5 - 1)) + 1;
    if (dirCode === 1) {
      this.setState({ vector02: 'KeyW' });
    }
    if (dirCode === 2) {
      this.setState({ vector02: 'KeyS' });
    }
    if (dirCode === 3) {
      this.setState({ vector02: 'KeyA' });
    }
    if (dirCode === 4) {
      this.setState({ vector02: 'KeyD' });
    }
    this.intervalSnake02 = setInterval(this.move02, 500);
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

  snakeFeed02 = (nextPosition, foodStack) => {
    const keysFood = Object.keys(foodStack);
    keysFood.forEach(key => {
      if (
        nextPosition.x === foodStack[key].position.x &&
        nextPosition.y === foodStack[key].position.y
      ) {
        this.snakeGrow02();
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

  snakeGrow02 = () => {
    const positionStack = { ...this.state.positionStack02 };
    const countSnake = Object.keys(positionStack).length;
    const end = positionStack[countSnake - 1];
    positionStack[countSnake] = { x: end.x, y: end.y };
    this.setState({ positionStack02: positionStack });
  };

  foodOnSnake01 = (newFood, snakePosition01) => {
    let keysSnake01 = Object.keys(snakePosition01);
    keysSnake01.forEach(key => {
      if (
        newFood.position.x === snakePosition01[key].x &&
        newFood.position.y === snakePosition01[key].y
      )
        return;
    });
  };

  foodOnSnake02 = (newFood, snakePosition02) => {
    let keysSnake02 = Object.keys(snakePosition02);
    keysSnake02.forEach(key => {
      if (
        newFood.position.x === snakePosition02[key].x &&
        newFood.position.y === snakePosition02[key].y
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

  withOtherCollision = (position, snakePosition) => {
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
      this.intervalSnake02 = setInterval(this.move02, 500);
      this.intervalFood = setInterval(this.foodQueue, 1000);
      // return null;
    } else {
      this.setState({ gamePaused: true });
      clearInterval(this.intervalSnake01);
      clearInterval(this.intervalSnake02);
      clearInterval(this.intervalFood);
      return <Pause />;
    }
  };

  gameOver = () => {
    clearInterval(this.intervalSnake01);
    clearInterval(this.intervalSnake02);
    clearInterval(this.intervalFood);
    this.setState({ stateRestart: true });
  };

  changePosition01 = position01 => {
    const foodStack = { ...this.state.foodStack };
    this.snakeFeed01(position01, foodStack);
    const positionStack01 = { ...this.state.positionStack01 };
    if (this.withOtherCollision(position01, this.state.positionStack02));
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

  changePosition02 = position02 => {
    const foodStack = { ...this.state.foodStack };
    this.snakeFeed02(position02, foodStack);
    const positionStack02 = { ...this.state.positionStack02 };
    if (this.withOtherCollision(position02, this.state.positionStack01));
    if (this.selfCollision(position02, positionStack02));
    if (!this.borderCollision(position02));
    const countSnake02 = Object.keys(positionStack02).length;
    for (let i = countSnake02 - 1; i >= 1; i--) {
      positionStack02[i] = {};
      const current = positionStack02[i];
      const prev = positionStack02[i - 1];
      current.x = prev.x;
      current.y = prev.y;
    }
    positionStack02[0].x = position02.x;
    positionStack02[0].y = position02.y;
    this.setState({ positionStack02: positionStack02 });
  };

  handleInput01 = e => {
    if (e.code === 'ArrowUp' && this.state.vector01 === 'ArrowDown') return;
    if (e.code === 'ArrowDown' && this.state.vector01 === 'ArrowUp') return;
    if (e.code === 'ArrowLeft' && this.state.vector01 === 'ArrowRight') return;
    if (e.code === 'ArrowRight' && this.state.vector01 === 'ArrowLeft') return;
    if (e.code === 'Space') return this.gamePaused();
    if (
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight'
    ) {
      this.setState({ vector01: e.code });
    }
  };

  handleInput02 = e => {
    if (e.code === 'KeyW' && this.state.vector02 === 'KeyS') return;
    if (e.code === 'KeyS' && this.state.vector02 === 'KeyW') return;
    if (e.code === 'KeyA' && this.state.vector02 === 'KeyD') return;
    if (e.code === 'KeyD' && this.state.vector02 === 'KeyA') return;
    if (
      e.code === 'KeyW' ||
      e.code === 'KeyS' ||
      e.code === 'KeyA' ||
      e.code === 'KeyD'
    ) {
      this.setState({ vector02: e.code });
    }
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

  move02 = () => {
    const head02 = this.state.positionStack02[0];
    if (this.state.vector02 === 'KeyW') {
      this.changePosition02({ x: head02.x, y: head02.y - Field._cell });
    }
    if (this.state.vector02 === 'KeyS') {
      this.changePosition02({ x: head02.x, y: head02.y + Field._cell });
    }
    if (this.state.vector02 === 'KeyA') {
      this.changePosition02({ x: head02.x - Field._cell, y: head02.y });
    }
    if (this.state.vector02 === 'KeyD') {
      this.changePosition02({ x: head02.x + Field._cell, y: head02.y });
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
        <div className='boxes01'>{this.renderBoxes01()}</div>
        <div className='boxes02'>{this.renderBoxes02()}</div>
      </div>
    );
  };

  renderBoxes01 = () => {
    const boxes = this.state.positionStack01;
    return Object.keys(boxes).map(id => {
      return <Box01 key={id} movingBox={boxes[id]} boxSize={Field._cell} />;
    });
  };

  renderBoxes02 = () => {
    const boxes = this.state.positionStack02;
    return Object.keys(boxes).map(id => {
      return <Box02 key={id} movingBox={boxes[id]} boxSize={Field._cell} />;
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
