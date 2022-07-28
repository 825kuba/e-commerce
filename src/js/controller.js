'use strict';

import * as model from './model.js';
import productsView from './productsView.js';

async function controlLoadProductsByCategory() {
  try {
    //render spinner
    productsView.renderSpinner();
    //get ID of html page
    const id = document.body.id;
    // don't do anything on index page
    if (id === 'index') return;
    // get products in category based on ID
    await model.getProducts(id);
    //render products
    productsView.renderProductsByCategory(model.state.categories[`${id}`]);
  } catch (err) {
    productsView.renderError(err.message);
  }
}

controlLoadProductsByCategory();

////////////////////////////////////
// basic functionality of btns
const menuBtn = document.querySelector('.nav__nav-btn');
const navLinks = document.querySelector('.nav__links');
const closeMenuBtn = document.querySelector('.nav__close-nav');

menuBtn.addEventListener('click', e => {
  e.preventDefault();
  navLinks.classList.add('open');
  document.body.classList.add('no-scroll');
});

closeMenuBtn.addEventListener('click', e => {
  e.preventDefault();
  navLinks.classList.remove('open');
  document.body.classList.remove('no-scroll');
});

const cartBtn = document.querySelector('.nav__cart-btn');
const cart = document.querySelector('.nav__cart');
const closeCartBtn = document.querySelector('.nav__cart__close-cart');

cartBtn.addEventListener('click', e => {
  e.preventDefault();
  cart.classList.add('open');
  document.body.classList.add('no-scroll');
});

closeCartBtn.addEventListener('click', e => {
  e.preventDefault();
  cart.classList.remove('open');
  document.body.classList.remove('no-scroll');
});
