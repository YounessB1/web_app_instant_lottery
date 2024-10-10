import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState} from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, useNavigate  } from 'react-router-dom';

import NavHeader from "./components/NavHeader";
import { LoginForm } from './components/AuthComponents';
import  { GameRules }  from './components/GameRules';
import  { Game } from './components/Game';
import  { Ranking }  from './components/Ranking';
import API from './API.mjs';

function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [, setUser] = useState('');

  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser('');
    navigate('/login')
  };


  return (
    <Routes>
      <Route element={<>
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
        </>
      }>
        <Route index element={
          loggedIn ? <Game setMessage={setMessage}/> : <GameRules/>
        } />
        <Route path="/top3"   element={
          loggedIn ? <Ranking/> : <GameRules/>
        }/>
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>
  );
}


export default App
