/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import API from '../API.mjs';

function BetBoard( props ) {
  const [isLocked, setIsLocked] = useState(false);

  const handleNumberClick = (number) => {
    if (isLocked) return;
  
    setIsLocked(true); // Blocca ulteriori modifiche
  
    new Promise((resolve) => {
      props.setSelectedNumbers((prevSelectedNumbers) => {
        const isSelected = prevSelectedNumbers.includes(number);
  
        if (!isSelected && prevSelectedNumbers.length < 3) {
          if (props.tokens >= 5) {
            resolve(-5); // Decrementa i token di 5
            return [...prevSelectedNumbers, number];
          }
        } else if (isSelected) {
          resolve(5); // Incrementa i token di 5
          return prevSelectedNumbers.filter((n) => n !== number);
        }
  
        resolve(0); // Nessuna modifica ai token
        return prevSelectedNumbers;
      });
    }).then((tokenChange) => {
      if (tokenChange !== 0) {
        props.setTokens((prevTokens) => prevTokens + tokenChange);
      }
      setIsLocked(false); // Sblocca dopo l'operazione
    });
  };

  const handleBetClick = async () => {
    try{
      await API.bet(props.selectedNumbers)
      props.setSelectedNumbers([]);
    }
    catch{
      props.setMessage({msg: `You have already a bet this turn`, type: 'danger'})
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      <h2 className="mb-4">Bet Board</h2>
      <div
        className="d-grid mb-4"
        style={{ 
          gridTemplateColumns: 'repeat(30, 1fr)', 
          gap: '10px',
          maxWidth: '100%', 
        }}
      >
        {[...Array(90)].map((_, index) => {
          const number = index + 1;
          const isSelected = props.selectedNumbers.includes(number);
          return (
            <Button
              key={number}
              variant={isSelected ? 'primary' : 'outline-secondary'}
              onClick={() => handleNumberClick(number)}
              className="number-cell"
              style={{
                width: '35px',
                height: '35px',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {number}
            </Button>
          );
        })}
      </div>
      {props.selectedNumbers.length>0 && (
        <div className="d-flex justify-content-center w-100">
          <Button
            variant="danger"
            onClick={handleBetClick}
            className="btn-lg"
            style={{ width: '100px' }}
          >
            Bet
          </Button>
        </div>
      )}
    </Container>
  );
}

export default BetBoard;