import React, { useState, useEffect, useRef } from 'react';


export default function PomodoroTimer() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Session');
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          
          if (prev === 0) {
            audioRef.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBreakDecrement = () => {
    if (!isRunning && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (!isRunning && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (!isRunning && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (!isRunning && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      

      <div className="timer-container">
        <div className="row mb-4">
          <div className="col-6">
            <div className="control-group">
              <div id="break-label" className="control-label">Break Length</div>
              <div className="control-buttons">
                <button
                  id="break-decrement"
                  className="control-btn"
                  onClick={handleBreakDecrement}
                >
                  −
                </button>
                <div id="break-length" className="length-display">{breakLength}</div>
                <button
                  id="break-increment"
                  className="control-btn"
                  onClick={handleBreakIncrement}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="control-group">
              <div id="session-label" className="control-label">Session Length</div>
              <div className="control-buttons">
                <button
                  id="session-decrement"
                  className="control-btn"
                  onClick={handleSessionDecrement}
                >
                  −
                </button>
                <div id="session-length" className="length-display">{sessionLength}</div>
                <button
                  id="session-increment"
                  className="control-btn"
                  onClick={handleSessionIncrement}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="timer-display">
          <div id="timer-label" className="timer-label">{timerLabel}</div>
          <div id="time-left" className="time-left">{formatTime(timeLeft)}</div>
        </div>

        <div className="timer-controls">
          <button
            id="start_stop"
            className="timer-btn start-stop-btn"
            onClick={handleStartStop}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            id="reset"
            className="timer-btn reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <audio
          id="beep"
          ref={audioRef}
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
}