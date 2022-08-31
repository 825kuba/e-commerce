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
  console.log(clickedProduct);
  // get clicked product ID
  const clickedID = +clickedProduct.id;
  console.log(clickedID);
  // get page ID
  const pageID = document.body.id;
  console.log(pageID);
  // find the correct product in state
  const product = model.state.categories[`${pageID}`].find(
    ele => ele.id === clickedID
  );
  // check if product is on sale
  const sale = clickedProduct.querySelector('.products__price--before');
  product.isOnSale = sale ? true : false;
  // add properties to product object
  product.size = '';
  product.color = '';
  product.qty = 1;
  console.log(product);
  // pass new object to state
  model.state.session.productModal = product;
  model.saveToStorage();
  // init and render modal window
  productView.loadProduct(product, controlAddToCart);
}

function controlAddToCart() {
  // check if product already exists in cart
  //if the new product has the same ID, size, and color as some product alreadt in cart, we just increase quantity om the original product
  model.state.session.cart.push(model.state.session.productModal);
  console.log(model.state.session);
  model.saveToStorage();
  cartView.updateCart(model.state.session.cart);
}

function init() {
  model.loadFromStorage();
  navView.addEventMobileNav();
  cartView.addEventOpenCloseCart();
  productView.addEventCloseProduct();
  controlLoadProductsByCategory();
  categoryView.addEventListenerToCategoryProducts(controlProductModal);
  cartView.updateCart(model.state.session.cart);
}
init();
