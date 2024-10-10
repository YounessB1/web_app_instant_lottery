/* eslint-disable react/prop-types */

import { useEffect, useState} from 'react';
import { Table } from 'react-bootstrap';
import API from '../API.mjs';



const Ranking = () => {
    const [players, setPlayers] = useState(false);

    useEffect(() => {
        const getTop3= async () => {
          const players = await API.getTop3Players();
          setPlayers(players);
        };
        getTop3();
    }, []);

    return (
      <div className='container mt-4'>
        <h2 className='mb-4'>Top 3 Players</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.slice(0, 3).map((player, index) => (
                <tr key={player.id}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.surname}</td>
                  <td>{player.tokens}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className='text-center'>No players available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  };
  
export  {Ranking} ;