import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';

const Menu = () => (
  <>
    <p>
      <a href='/home'>Home</a>
    </p>
    <p>
      <a href='/books'>View My Collection</a>
    </p>
    <p>
      <a href='/main'>Search a Book</a>
    </p>
  </>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <nav className='navbar'>
      <div className='navbar-links'>
        <div className='navbar-links_logo'>
          {/* <img src={logo} alt='logo' /> */}
        </div>
        <div className='navbar-links_container'>
          <Menu />
        </div>
      </div>
      <div className='navbar-menu'>
        {toggleMenu ? (
          <RiCloseLine color='#000' size={27} onClick={() => setToggleMenu(false)} />
        ) : (
          <RiMenu3Line color='#000' size={27} onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <div className='navbar-menu_container scale-up-center'>
            <div className='navbar-menu_container-links'>
              <Menu />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
