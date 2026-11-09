import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';

function Navbar() {
  const [cartView, setCartView] = useState(false);
  const data = useCart();
  const navigate = useNavigate();
  const loggedIn = Boolean(localStorage.getItem('authToken'));
  const itemCount = data.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md bc-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand bc-brand" to="/">
          <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="" />
          Bite-Cloud
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" end to="/">
                Menu
              </NavLink>
            </li>
          </ul>
          {!loggedIn ? (
            <div className="d-flex gap-2 py-2 py-md-0">
              <Link className="btn btn-outline-light" to="/login">
                Log in
              </Link>
              <Link className="btn btn-success" to="/createuser">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-2 py-2 py-md-0">
              <button type="button" className="btn btn-success" onClick={() => setCartView(true)}>
                My cart{' '}
                <Badge pill bg="light" text="dark">
                  {itemCount}
                </Badge>
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
      {cartView && (
        <Modal title="Your cart" onClose={() => setCartView(false)}>
          <Cart />
        </Modal>
      )}
    </nav>
  );
}

export default Navbar;
