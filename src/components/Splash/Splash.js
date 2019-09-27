import React from 'react';
import './Splash.css';

class Splash extends React.Component {
  startClick = e => {
    console.log(this.props);
    this.props.setStateStart(false);
    console.log(this.props);
  };

  render() {
    return (
      <div className='splash'>
        <div>Snake Game</div>
        <div>Control</div>
        <div className='control'>
          <div>
            <div className='orange-snake'></div>
            <div className='orange-snake'></div>
            <div className='orange-snake'></div>
            <div className='orange-snake'></div>
          </div>
          <div>
            <div>W</div>
            <div>S</div>
            <div>A</div>
            <div>D</div>
          </div>
          <div>
            <div>Up</div>
            <div>Down</div>
            <div>Left</div>
            <div>Right</div>
          </div>
          <div>
            <div>&uarr;</div>
            <div>&darr;</div>
            <div>&larr;</div>
            <div>&rarr;</div>
          </div>
          <div>
            <div className='green-snake'></div>
            <div className='green-snake'></div>
            <div className='green-snake'></div>
            <div className='green-snake'></div>
          </div>
        </div>
        <div className='start' onClick={this.startClick}>
          START
        </div>
      </div>
    );
  }
}

export default Splash;
