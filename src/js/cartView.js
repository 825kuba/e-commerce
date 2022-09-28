'use strict';

const cartBtn = document.querySelector('.nav__cart-btn');
const cartEle = document.querySelector('.nav__cart');
const closeCartBtn = document.querySelector('.nav__cart__close-cart');
const cartContent = document.querySelector('.nav__cart__content');
const cartSubtotal = document.querySelector('.nav__cart__subtotal span');
const productModal = document.querySelector('.product-modal');
const cartMsg = document.querySelector('.nav__cart__message');
const cartMsgBtn = document.querySelector('.nav__cart__message button');

import GeneralView from './generalView.js';

class CartView extends GeneralView {
  parentEle = document.querySelector('.nav__cart__container');
  cartMsgTimer;

  addEventOpenCloseCart() {
    // open cart
    cartBtn.addEventListener('click', e => {
      e.preventDefault();
      cartEle.classList.add('open');
      document.body.classList.add('no-scroll');
    });

    // close cart
    closeCartBtn.addEventListener('click', e => {
      e.preventDefault();
      cartEle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });

    // close cart with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close product modal
      cartEle.classList.remove('open');
      // return scrolling to body
      document.body.classList.remove('no-scroll');
    });
  }

  renderCart(cart) {
    // update cart container - render cart items
    cartContent.innerHTML = `
      <div class="nav__cart__container"></div>
    `;
    this.parentEle = document.querySelector('.nav__cart__container');
    cart.forEach(item => {
      this.parentEle.insertAdjacentHTML(
        'beforeend',
        `
        <div class="nav__cart__item" id="${item.id}">
          <img
            src="${
              document.body.id === 'index' ? '' : '.'
            }./img/placeholder.jpg"
            data-src="${item.image}"
            class="nav__cart__item__img"
            data-color="color-${item.specs.color}"
          />
          <div class="nav__cart__item__text">
            <a href="#" class="nav__cart__item__name"
              >${item.title}</a
            >
            <p class="nav__cart__item__size">${item.specs.size} / ${
          item.specs.color === 'Natural' ? '' : 'Color'
        } ${item.specs.color}</p>
          </div>
          <p class="nav__cart__item__price">$<span>${item.price}</span></p>

          <form class="nav__cart__item__qty" action="">
            <div class="nav__cart__item__input-wrap">
              <button type="button"         class="nav__cart__item__minus">-</button>
              <input class="product__qty"
                type="number"
                min="1"
                max="10"
                step="1"
                value="${item.specs.qty}"
                id="number"
              />
              <button type="button" class="nav__cart__item__plus">+</button>
            </div>
          </form>

          <button class="nav__cart__item__remove">Remove</button>
        </div>
        `
      );
    });
    // update cart subtotal
    let totalPrice = 0;
    cart.forEach(item => {
      const price = item.specs.qty * item.price;
      totalPrice += price;
    });
    cartSubtotal.innerText = totalPrice.toFixed(2);
  }

  updateCartBtn(cart) {
    // update cart btn number
    cartBtn.querySelector('span').innerText = `${cart.length}`;
  }

  // handler event lsiteners on cart items
  addListenerCartItems(cart, removeHandler, qtyHandler, productHandler) {
    // add one listener to cart container - a new one is created each time the cart is re-rendered, so there is always just one event listener
    this.parentEle.addEventListener('click', e => {
      e.preventDefault();
      // declare or the possible event targets
      const remove = e.target.closest('.nav__cart__item__remove');
      const plus = e.target.closest('.nav__cart__item__plus');
      const minus = e.target.closest('.nav__cart__item__minus');
      const name = e.target.closest('.nav__cart__item__name');
      const img = e.target.closest('.nav__cart__item__img');
      // get the target's closest cart item
      const item = e.target.closest('.nav__cart__item');
      // get index of item in cart
      const index = [
        ...cartContent.querySelectorAll('.nav__cart__item'),
      ].indexOf(item);
      // depending on target, perform specific actions
      if (e.target === remove) {
        // remove cart item
        removeHandler(index);
      }
      if (e.target === plus) {
        // increase qty of cart item
        const updatedCart = cart;
        if (updatedCart[index].specs.qty >= 10) return;
        updatedCart[index].specs.qty++;
        qtyHandler(updatedCart);
      }
      if (e.target === minus) {
        // decrease qty of cart item
        const updatedCart = cart;
        if (updatedCart[index].specs.qty <= 1) return;
        updatedCart[index].specs.qty--;
        qtyHandler(updatedCart);
      }
      if (e.target === name || e.target === img) {
        // close cart and open cart item's product
        productModal.classList.add('open');
        cartEle.classList.remove('open');
        document.body.classList.add('no-scroll');
        productHandler(item);
      }
    });
    // handle quantity input field submision
    // select all forms in cart
    const qtyFields = [
      ...this.parentEle.querySelectorAll('.nav__cart__item__qty'),
    ];
    // for each add listener for submit
    qtyFields.forEach(ele => {
      ele.addEventListener('submit', e => {
        e.preventDefault();
        // get the target's closest cart item
        const item = e.target.closest('.nav__cart__item');
        // get index of item in cart
        const index = [
          ...cartContent.querySelectorAll('.nav__cart__item'),
        ].indexOf(item);
        // get new value
        const updatedCart = cart;
        const newValue = ele.querySelector('.product__qty').value;
        // guard clause (empty string)
        if (!newValue) return;
        // change the value in cart
        updatedCart[index].specs.qty = +newValue;
        // run handler
        qtyHandler(updatedCart);
      });
    });
  }

  // add event listener to message close btn
  cartMsgAddListener() {
    cartMsgBtn.addEventListener('click', e => {
      e.preventDefault();
      cartMsg.classList.add('hidden');
    });
  }

  // show cart message
  cartMsgShow() {
    // only show if cart is already opened (i.e. when user changes item qty)
    if (!cartEle.classList.contains('open')) return;
    // hide msg
    cartMsg.classList.remove('hidden');
    // clear any previous timeouts
    clearTimeout(this.cartMsgTimer);
    // set new timeout
    this.cartMsgTimer = setTimeout(() => {
      cartMsg.classList.add('hidden');
    }, 2000);
  }

  updateCart(cart, removeHandler, qtyHandler, productHandler) {
    this.renderSpinner();
    this.renderCart(cart);
    this.updateCartBtn(cart);
    this.addListenerCartItems(cart, removeHandler, qtyHandler, productHandler);
    this.observeImgs('.nav__cart__item__img');
    this.cartMsgShow();
  }
}

export default new CartView();
