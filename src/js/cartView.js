'use strict';

const cartBtn = document.querySelector('.nav__cart-btn');
const cart = document.querySelector('.nav__cart');
const closeCartBtn = document.querySelector('.nav__cart__close-cart');
const cartContainer = document.querySelector('.nav__cart__container');
const cartSubtotal = document.querySelector('.nav__cart__subtotal span');

class CartView {
  addEventOpenCloseCart() {
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

    // close cart with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close product modal
      cart.classList.remove('open');
      // return scrolling to body
      document.body.classList.remove('no-scroll');
    });
  }

  updateCart(cart) {
    // update cart btn number
    cartBtn.querySelector('span').innerText = `${cart.length}`;
    //create set from cart array - avoid duplicates
    const cartSet = new Set(cart);
    console.log(cartSet);
    // update cart container - render cart items
    cartContainer.innerHTML = '';
    cart.forEach(item => {
      cartContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div class="nav__cart__item">
          <a href="#" class="nav__cart__item__img">
            <img
              src="${item.image}"
            />
          </a>
          <div class="nav__cart__item__text">
            <a href="#" class="nav__cart__item__name"
              >${item.title}</a
            >
            <p class="nav__cart__item__size">XL</p>
          </div>
          <p class="nav__cart__item__price">$<span>${item.price}</span></p>
          <div class="nav__cart__item__count">
            <button class="nav__cart__item__minus">
              <i class="las la-minus"></i>
            </button>
            <span class="nav__cart__item__num">1</span>
            <button class="nav__cart__item__plus">
              <i class="las la-plus"></i>
            </button>
          </div>
          <button   class="nav__cart__item__remove">Remove</button>
        </div>
        `
      );
    });
    // update cart subtotal
    let totalPrice = 0;
    [...document.querySelectorAll('.nav__cart__item__price span')].forEach(
      item => {
        const price = +item.innerText;
        totalPrice += price;
      }
    );
    console.log(totalPrice.toFixed(2));
    cartSubtotal.innerText = totalPrice.toFixed(2);
  }
}

export default new CartView();
