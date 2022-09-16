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
    await model.fetchProductsByCategory(id);
    //render products
    categoryView.renderCategoryProducts(model.state.categories[`${id}`]);
  } catch (err) {
    categoryView.renderError(err.message);
  }
}

// control creating product modal window after clicking product in category section
async function controlOpenProduct(clickedProduct) {
  try {
    //render spinner
    productView.renderSpinner();
    // get clicked product ID
    const clickedID = +clickedProduct.id;
    // get page ID
    const pageID = document.body.id;
    // find the correct product in state
    const productInCategory = model.state.categories[`${pageID}`]?.find(
      ele => ele.id === clickedID
    );
    // if category doesn't exists in state object fetch product from API, then pass product to state
    model.state.session.productModal = productInCategory
      ? productInCategory
      : await model.fetchSingleProduct(clickedID);
    // save to storage
    model.saveToStorage();
    // init and render modal window
    productView.loadProduct(model.state.session.productModal, controlAddToCart);
  } catch (err) {
    console.error(err);
  }
}

function controlAddToCart(specs) {
  // debugger;
  // create new object and give it specs from argument
  const newProduct = model.state.session.productModal;
  newProduct.specs = specs;
  newProduct.specs.code = `${newProduct.id}-${newProduct.specs.size}-${newProduct.specs.color}`;
  // console.log(newProduct);
  // console.log(product);

  // create condition - check if item has the same ID, size, and color ❌BUGGED❌ - unexpected behaviour
  // const alreadyExists = item => {
  //   console.log(model.state.session.cart);
  //   console.log('original:', product.id, 'current:', item.id);
  //   console.log('original:', product.specs.size, 'current:', item.specs.size);
  //   console.log('original:', product.specs.color, 'current:', item.specs.color);
  //   console.log('-----------------');
  //   return (
  //     item.id === product.id &&
  //     item.specs.size === product.specs.size &&
  //     item.specs.color === product.specs.color
  //   );
  // };

  const originalItem = model.state.session.cart.find(
    item => item.specs.code === newProduct.specs.code
  );

  console.log(
    model.state.session.cart.find(
      item => item.specs.code === newProduct.specs.code
    )
  );

  // console.log(originalItem);

  if (!originalItem) {
    console.log('no match');
    model.state.session.cart.push(newProduct);
  } else {
    console.log('match');
    const index = model.state.session.cart.findIndex(
      item => item === originalItem
    );
    model.state.session.cart[index].specs.qty += newProduct.specs.qty;
  }

  console.log(model.state.session.cart);

  // check if product already exists in cart
  // console.log(
  //   model.state.session.cart.some(
  //     item =>
  //       item.id === product.id &&
  //       item.specs.size === product.specs.size &&
  //       item.specs.color === product.specs.color
  //   )
  // );

  // console.log(model.state.session.cart.some(item => alreadyExists(item)));

  // if (model.state.session.cart.some(item => alreadyExists(item))) {
  //   // if it does
  //   // find index of the original item in cart
  //   const index = model.state.session.cart.findIndex(item =>
  //     alreadyExists(item)
  //   );
  //   // increase quantity on the original product
  //   model.state.session.cart[index].specs.qty += product.specs.qty;
  //   // console.log(model.session.cart[index]);
  // } else {
  //   // else add new item to cart
  //   model.state.session.cart.push(product);
  //   // console.log(model.state.session.cart.some(item => alreadyExists(item)));
  //   // console.log(product);
  // }
  //save to local storage
  model.saveToStorage();
  // render cart
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct
  );
  // hide product
  document.querySelector('.product-modal').classList.remove('open');
  // open cart
  document.querySelector('.nav__cart').classList.add('open');
}

// remove items from cart
function controlRemoveFromCart(index) {
  // delete the item on given index from cart
  model.state.session.cart.splice(index, 1);
  //save to local storage
  model.saveToStorage();
  // update cart
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct
  );
}

function controlCartItemQty(updatedCart) {
  console.log('running');
  model.state.session.cart = updatedCart;
  model.saveToStorage();
  // update cart
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct
  );
}

function init() {
  model.loadFromStorage();
  navView.addEventMobileNav();
  cartView.addEventOpenCloseCart();
  productView.addEventCloseProduct();
  controlLoadProductsByCategory();
  categoryView.addEventListenerToCategoryProducts(controlOpenProduct);
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct
  );
}
init();
