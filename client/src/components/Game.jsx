/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState,useEffect,useCallback } from 'react';
import Timer from './Timer';
import BetBoard from './BetBoard'
import { Container, Row, Col } from 'react-bootstrap';
import API from '../API.mjs';

function Game(props) {
  const [draw,setDraw] = useState([]); 
  const [bet,setBet] = useState([]); 
  const [gainedTokens,setGainedTokens] = useState(0); 
  const [tokens, setTokens] = useState(100);
  const [seconds, setSeconds] = useState(120);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleRound = useCallback(async () =>{
    try{
        const round = await API.getRound();
        setDraw(round.draw);
        setBet(round.bet);
        setGainedTokens(round.gainedTokens);
        const roundTimestamp = new Date(round.timestamp);
        const now = new Date();
        setSeconds(120- Math.floor((now - roundTimestamp) / 1000));
        setTokens(round.tokens);
        props.setMessage('');
        setSelectedNumbers([]);
    }
    catch{
        console.log("error getting the round HandleRound")
    }
  },[]);

  useEffect(() => {
    handleRound();
  },[handleRound]);

  return (
    <div>
      <Timer seconds={seconds} setSeconds={setSeconds} handleRound={handleRound}/>
      <Container className="mt-4 mb-8">
        {/* Draw */}
        <Row className="mb-4 align-items-center">
            <Col xs="auto">
            <h2 className="mb-0">Last Draw</h2>
            </Col>
            <Col className="d-flex">
            {draw.map((number) => (
                <div
                key={number}
                className="d-flex align-items-center justify-content-center"
                style={{
                    width: '50px',
                    height: '50px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '5px',
                }}
                >
                {number}
                </div>
            ))}
            </Col>
            <Col xs="auto" className="ml-auto d-flex align-items-center">
            <h5 className="mb-0">Tokens</h5>
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
            <div
                className="d-flex align-items-center justify-content-center"
                style={{
                width: '50px',
                height: '50px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                }}
            >
                {tokens}
            </div>
            </Col>
        </Row>

        {/* Bet */}
        <Row className="mb-4 align-items-center">
            <Col xs="auto">
            <h2 className="mb-0">Your Last Bet</h2>
            </Col>
            <Col className="d-flex">
            {bet.map((number) => (
                <div
                key={number}
                className="d-flex align-items-center justify-content-center"
                style={{
                    width: '50px',
                    height: '50px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginRight: '5px',
                }}
                >
                {number}
                </div>
            ))}
            </Col>
        </Row>

        {/*Gained Points */}
        <Row>
            <Col xs="auto">
            <h5 className="mb-0" style={{ color: '#6c757d' }}>You Gained {gainedTokens} tokens from the last bet </h5>
            </Col>
        </Row>
      </Container>
      <BetBoard tokens={tokens} setTokens={setTokens} setMessage={props.setMessage} selectedNumbers={selectedNumbers} setSelectedNumbers={setSelectedNumbers}/>
    </div>
  );
}

  
export {Game}