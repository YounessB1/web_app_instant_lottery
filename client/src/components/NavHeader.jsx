/* eslint-disable react/prop-types */
import { Container, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from './AuthComponents';

// UPDATED
function NavHeader (props) {
  const location = useLocation()

  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>Instant Lottery</Link>
        <div className='d-flex ms-auto'>
        {props.loggedIn ? (
          <>
            {location.pathname !== '/top3' ? (
              <Link to='/top3' className='btn btn-outline-warning link-warning me-2'>Top3</Link>
            ) : (
              <Link to='/' className='btn btn-outline-warning link-warning me-2'>Home</Link>
            )}
            <LogoutButton logout={props.handleLogout} />
          </>
        ) : (
          <Link to='/login' className='btn btn-outline-light'>Login</Link>
        )}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
