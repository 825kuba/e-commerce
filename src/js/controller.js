'use strict';

import * as model from './model.js';
import categoryView from './categoryView.js';
import productView from './productView.js';
import navView from './navView.js';
import cartView from './cartView.js';

async function controlLoadProductsByCategory() {
  // only load products if on a products page
  if (!window.location.href.includes('products/')) return;
  try {
    //render spinner
    categoryView.renderSpinner();
    //get ID of html page
    const id = document.body.id;
    // get products in category based on ID
    await model.getProducts(id);
    //render products
    categoryView.renderCategoryProducts(model.state.categories[`${id}`]);
  } catch (err) {
    categoryView.renderError(err.message);
  }
}

// control creating product modal window after clicking product in category section
function controlProductModal(clickedProduct) {
  // get clicked product ID
  const clickedID = +clickedProduct.id;
  // get page ID
  const pageID = document.body.id;
  // find the correct product in state
  const product = model.state.categories[`${pageID}`].find(
    ele => ele.id === clickedID
  );
  // check if product is on sale
  const sale = clickedProduct.querySelector('.products__price--before');
  product.isOnSale = sale ? true : false;
  // pass new object to state
  model.state.session.productModal = product;
  model.saveToStorage();
  // init and render modal window
  productView.loadProduct(product, controlAddToCart);
}

function controlAddToCart(specs) {
  // create new object and give it specs from argument
  const product = model.state.session.productModal;
  product.specs = specs;
  console.log(product.id);

  // create condition - check if item has the same ID, size, and color ❌BUGGED❌ - unexpected behaviour
  const alreadyExists = item =>
    item.id === product.id &&
    item.specs.size === product.specs.size &&
    item.specs.color === product.specs.color;

  // check if product already exists in cart
  if (model.state.session.cart.some(item => alreadyExists(item))) {
    // if it does
    // find index of the original item in cart
    const index = model.state.session.cart.findIndex(item =>
      alreadyExists(item)
    );
    // increase quantity on the original product
    model.state.session.cart[index].specs.qty += product.specs.qty;
    console.log('added to original item');
  } else {
    // else add new item to cart
    model.state.session.cart.push(product);
    console.log('added to cart');
    document.querySelector('.product-modal').classList.remove('open');
    document.querySelector('.nav__cart').classList.add('open');
  }
  //save to local storage
  model.saveToStorage();
  // render cart
  cartView.updateCart(model.state.session.cart, controlRemoveFromCart);
}

// remove items from cart
function controlRemoveFromCart(index) {
  // delete the item on given index from cart
  model.state.session.cart.splice(index, 1);
  //save to local storage
  model.saveToStorage();
  // update cart
  cartView.updateCart(model.state.session.cart, controlRemoveFromCart);
}

function init() {
  model.loadFromStorage();
  navView.addEventMobileNav();
  cartView.addEventOpenCloseCart();
  productView.addEventCloseProduct();
  controlLoadProductsByCategory();
  categoryView.addEventListenerToCategoryProducts(controlProductModal);
  cartView.updateCart(model.state.session.cart, controlRemoveFromCart);
}
init();
