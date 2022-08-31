'use strict';

//nav menu
const menuBtn = document.querySelector('.nav__nav-btn');
const navLinks = document.querySelector('.nav__links');
const closeMenuBtn = document.querySelector('.nav__close-nav');

class NavView {
  addEventMobileNav() {
    // open mobile menu
    menuBtn.addEventListener('click', e => {
      e.preventDefault();
      navLinks.classList.add('open');
      document.body.classList.add('no-scroll');
    });

    // close mmobile menu
    closeMenuBtn.addEventListener('click', e => {
      e.preventDefault();
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });

    // close mobile menu with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close mobile menu and return scrolling to body
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  }
}

export default new NavView();
