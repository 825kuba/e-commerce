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

  renderCart(cart) {
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
            <p class="nav__cart__item__size">${item.specs.size} / Color ${item.specs.color}</p>
          </div>
          <p class="nav__cart__item__price">$<span>${item.price}</span></p>

          <form class="nav__cart__item__qty">
            <div class="nav__cart__item__input-wrap">
              <button type="button"         class="nav__cart__item__minus">-</button>
              <input class="product__qty"
                type="number"
                min="1"
                value="${item.specs.qty}"
                class="nav__cart__item__num"
                id="number"
              />
              <button type="button"     class="nav__cart__item__plus">+</button>
            </div>
          </form>

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
    cartSubtotal.innerText = totalPrice.toFixed(2);
  }

  updateCartBtn(cart) {
    // update cart btn number
    cartBtn.querySelector('span').innerText = `${cart.length}`;
  }

  // remove btn event
  addEventListenerRemoveBtn(handler) {
    // for each remove btn
    [...cartContainer.querySelectorAll('.nav__cart__item__remove')].forEach(
      btn => {
        // add event listener
        btn.addEventListener('click', e => {
          e.preventDefault();
          // get the item
          const item = btn.closest('.nav__cart__item');
          // get index of item in cart
          const index = [
            ...cartContainer.querySelectorAll('.nav__cart__item'),
          ].indexOf(item);
          // run handler with index
          handler(index);
        });
      }
    );
  }

  updateCart(cart, handler) {
    this.renderCart(cart);
    this.updateCartBtn(cart);
    this.addEventListenerRemoveBtn(handler);
  }
}

export default new CartView();
