'use strict';

import * as model from './model.js';
import categoryView from './categoryView.js';
import productView from './productView.js';
import mainPageView from './mainPageView.js';
import navView from './navView.js';
import cartView from './cartView.js';
import checkoutView from './checkoutVIew.js';

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
    controlOpenProduct,
    model.state.session.checkout,
    controlAddingDiscount,
    controlUpdateSubtotal
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
    controlOpenProduct,
    model.state.session.checkout,
    controlAddingDiscount,
    controlUpdateSubtotal
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
    controlOpenProduct,
    model.state.session.checkout,
    controlAddingDiscount,
    controlUpdateSubtotal
  );
}

function controlUpdateSubtotal(price) {
  // update state object
  model.state.session.checkout.details.subtotal = price;
  //save to storage
  model.saveToStorage();
}

function controlCloseCartOpenCheckout() {
  if (!model.state.session.cart.length) return;
  cartView.closeCart();
  checkoutView.renderInformationSection(model.state.session.checkout);
  checkoutView.openCheckout();
}

function controlCloseCheckoutOpenCart() {
  checkoutView.closeCheckout();
  cartView.openCart();
}

function controlSubmitForm(objName, obj) {
  // save information form
  if (objName === 'information') model.state.session.checkout.information = obj;
  // save shipping form
  else if (objName === 'shipping') model.state.session.checkout.shipping = obj;
  // handle payment form
  else if (objName === 'payment') {
    // if save details checkbox not selected, reset customer information
    if (!obj.save) {
      model.state.session.checkout.information = {};
      model.state.session.checkout.shipping = {};
      model.state.session.checkout.payment = {};
    }
    // else save payment details to state
    else model.state.session.checkout.payment = obj;

    // reset the following in state:
    // product modal
    model.state.session.productModal = {};
    // cart
    model.state.session.cart = [];
    // discount
    model.state.session.checkout.discount = {};
    // price details
    model.state.session.checkout.details = {
      subtotal: 0,
    };
  }
  // save to local storage
  model.saveToStorage();
}

function controlAddingDiscount(newCode, inputEle) {
  // find inputed code in array of codes
  const code = model.state.discountCodes.find(obj => obj.code === newCode);
  const ele = inputEle;
  // save code - if code doesnt exist save empty obj
  model.state.session.checkout.discount = code ? code : {};
  model.saveToStorage();

  // render discount line
  checkoutView.updatePrices(model.state.session.checkout);

  // if code exists
  if (code) {
    // show discount line in summary
    checkoutView.showDiscount();
    // show success
    checkoutView.setInputSuccess(ele);
  }
  // if it doesnt
  else {
    // hide discount line in summary
    checkoutView.hideDiscount();
    // show success
    checkoutView.setInputError(ele, 'Please enter valid code');
  }

  // set correct height of summary container
  checkoutView.calcSummaryHeight();
}

function init() {
  model.loadFromStorage();
  navView.addEventMobileNav();
  cartView.addEventOpenCloseCart();
  cartView.addHandlerCheckoutBtn(controlCloseCartOpenCheckout);
  checkoutView.addListenerCloseCheckout();
  checkoutView.addHandlerCheckoutNav(
    controlCloseCheckoutOpenCart,
    model.state.session.checkout
  );
  checkoutView.addListenerCartSummary();
  checkoutView.addHandlerReturnBtn(
    controlCloseCheckoutOpenCart,
    model.state.session.checkout
  );
  checkoutView.addHandlerSubmitForm(
    controlSubmitForm,
    model.state.session.checkout,
    model.state.session.cart,
    controlAddingDiscount
  );
  productView.addEventCloseProduct();
  controlLoadProductsByCategory();
  categoryView.addEventListenerToCategoryProducts(controlOpenProduct);
  cartView.updateCart(
    model.state.session.cart,
    controlRemoveFromCart,
    controlCartItemQty,
    controlOpenProduct,
    model.state.session.checkout,
    controlAddingDiscount,
    controlUpdateSubtotal
  );
  cartView.cartMsgAddListener();
  mainPageView.addEventImageGallery();
  mainPageView.observeItems();
}
init();
