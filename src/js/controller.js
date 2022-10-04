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
    categoryView.observeImgs('.products__img');
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
  // create new object and give it specs from argument
  const newProduct = { ...model.state.session.productModal };
  newProduct.specs = specs;

  // create condition - check if item has the same ID, size, and color
  const alreadyExists = item => {
    return (
      item.id === newProduct.id &&
      item.specs.size === newProduct.specs.size &&
      item.specs.color === newProduct.specs.color
    );
  };

  // check if product already exists in cart
  if (model.state.session.cart.some(item => alreadyExists(item))) {
    // if it does
    // find index of the original item in cart
    const index = model.state.session.cart.findIndex(item =>
      alreadyExists(item)
    );
    // increase quantity on the original product
    model.state.session.cart[index].specs.qty += newProduct.specs.qty;
  } else {
    // else add new item to cart
    model.state.session.cart.push(newProduct);
  }
  //save to local storage
  model.saveToStorage();
  // render cart
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct
  );
  // close product and open cart
  productView.closeProductOpenCart();
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

// async function test() {
//   const response = await fetch('https://fakestoreapi.com/products');
//   const data = await response.json();
//   console.log(data);
//   const ele = document.querySelector('.test');
//   data.forEach(item => {
//     ele.insertAdjacentHTML(
//       'beforeend',
//       `
//       <img
//       src="${item.image}"
//       alt="product image"
//       class="test__img"
//     />
//     `
//     );
//   });
//   const imgs = [...document.querySelectorAll('.test__img')];
//   let arr = [];
//   window.addEventListener('load', () => {
//     imgs.forEach(img => {
//       const size = `${img.clientWidth}x${img.clientHeight}`;
//       arr.push(size);
//     });
//     console.log(arr);
//     console.log(new Set(arr));
//   });
// }

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
  cartView.cartMsgAddListener();
}
init();
