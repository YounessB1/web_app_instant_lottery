/* eslint-disable react/prop-types */
import  { useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

function Timer(props) {
    const totalDuration = 120; 
  
    useEffect(() => {
      if (props.seconds> 0) {
        const interval = setInterval(() => {
          props.setSeconds((prev) => prev - 1); 
        }, 1000);
  
        return () => clearInterval(interval);
      }
      else{
        props.handleRound();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.seconds]);
  
    const percentage = (props.seconds / totalDuration) * 100;
  
    return (
      <div>
        <ProgressBar now={percentage}/>
      </div>
    );
}

export default Timer;