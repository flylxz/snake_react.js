import React from 'react';
import './Restart.css';

class Restart extends React.Component {
  restartClick = e => {
    this.props.setStateRestart(false);
  };

  render() {
    return (
      <div className='restart-box'>
        <div>GAME OVER</div>
        <div className='button-restart' onClick={this.restartClick}>
          Restart
        </div>
      </div>
    );
  }
}
export default Restart;
