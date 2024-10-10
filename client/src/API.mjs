
const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const bet = async (bet) => {
  const response = await fetch(`${SERVER_URL}/api/bet`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({bet : bet})
  });
  if(response.ok) {
    const betJson = await response.json();
    return betJson;
  }
  else
    throw new Error('API bet error');
}

const getRound = async () => {
  const response = await fetch(`${SERVER_URL}/api/round`,{
    credentials: 'include'
  });
  if(response.ok) {
    const roundJson = await response.json();
    return roundJson;
  }
  else
    throw new Error('API round error');
}

const getTop3Players = async () => {
  const response = await fetch(`${SERVER_URL}/api/top3`,{
    credentials: 'include'
  });
  if(response.ok) {
    const playersJson = await response.json();
    return playersJson;
  }
  else
    throw new Error('API getting top 3 error');
}

const API = { logIn, logOut, getUserInfo, getTop3Players, bet, getRound };
export default API;