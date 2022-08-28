'use strict';

import * as model from './model.js';
import productsView from './productsView.js';
import generalView from './generalView.js';

async function controlLoadProductsByCategory() {
  // only load products if on a products page
  if (!window.location.href.includes('products/')) return;
  try {
    //render spinner
    productsView.renderSpinner();
    //get ID of html page
    const id = document.body.id;
    // get products in category based on ID
    await model.getProducts(id);
    //render products
    productsView.renderProductsByCategory(model.state.categories[`${id}`]);
  } catch (err) {
    productsView.renderError(err.message);
  }
}

function controlProductModal(clickedProduct) {
  console.log(clickedProduct);
  const clickedID = +clickedProduct.id;
  console.log(clickedID);
  const pageID = document.body.id;
  console.log(pageID);
  const product = model.state.categories[`${pageID}`].find(
    ele => ele.id === clickedID
  );
  const sale = clickedProduct.querySelector('.products__price--before');
  product.isOnSale = sale ? true : false;
  console.log(product);
  productsView.renderProductModal(product);
}

function init() {
  controlLoadProductsByCategory();
  generalView.initEvents();
  productsView.addEventListenerToProduct(controlProductModal);
  console.log(model.state);
}
init();
