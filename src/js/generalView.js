'use strict';

//menu
const menuBtn = document.querySelector('.nav__nav-btn');
const navLinks = document.querySelector('.nav__links');
const closeMenuBtn = document.querySelector('.nav__close-nav');
//cart
const cartBtn = document.querySelector('.nav__cart-btn');
const cart = document.querySelector('.nav__cart');
const closeCartBtn = document.querySelector('.nav__cart__close-cart');
//product modal
const productModal = document.querySelector('.product-modal');
const closeProductBtn = document.querySelector('.product__close-product');

class GeneralView {
  addMenuEvents() {
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
  }

  addCartEvents() {
    // open cart
    cartBtn.addEventListener('click', e => {
      e.preventDefault();
      cart.classList.add('open');
      document.body.classList.add('no-scroll');
    });

    // close cart
    closeCartBtn.addEventListener('click', e => {
      e.preventDefault();
      cart.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  }

  addProductModalEvents() {
    // check if page is index
    if (document.body.id === 'index') return;

    // close product modal
    closeProductBtn.addEventListener('click', e => {
      e.preventDefault();
      productModal.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  }

  addEscapeEvents() {
    // close mobile menu, cart, product modal with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close mobile menu, cart and return scrolling to body
      navLinks.classList.remove('open');
      cart.classList.remove('open');
      document.body.classList.remove('no-scroll');

      // check if page is index
      if (document.body.id === 'index') return;
      // close product modal
      productModal.classList.remove('open');
    });
  }

  initEvents() {
    this.addMenuEvents();
    this.addCartEvents();
    this.addProductModalEvents();
    this.addEscapeEvents();
  }
}

export default new GeneralView();
