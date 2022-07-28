'use strict';

const pictures = document.querySelector('.pic');
let products;
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(prod => {
    products = prod;
    console.log(products);
  });
//   .then(() => {
//     products.forEach(prod => {
//       pictures.insertAdjacentHTML(
//         'beforeend',
//         `
// <img src="${prod.image}" style="max-width: 20vw" />
// `
//       );
//     });
//   });

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
