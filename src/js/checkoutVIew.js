'use strict';

import GeneralView from './generalView.js';

const checkoutEle = document.querySelector('.checkout');
const closeCheckoutBtn = document.querySelector('.checkout__close-checkout');
const checkoutNav = document.querySelector('.checkout__nav');
const checkoutNavLinks = [...checkoutNav.querySelectorAll('.checkout__link')];
const cartBtn = document.querySelector('.checkout__link--cart');
const returnBtn = document.querySelector('.form__return');
const openSumBtn = document.querySelector('.checkout__summary-btn');
const openSumBtnText = document.querySelector('.checkout__summary-btn--text');
const openSumBtnPrice = document.querySelector('.checkout__summary-btn--price');
const cartContent = document.querySelector('.checkout__cart-content');

class CheckoutView extends GeneralView {
  parentEle = document.querySelector('.form__content');

  openCheckout() {
    checkoutEle.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  closeCheckout() {
    checkoutEle.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  addListenerCloseCheckout() {
    closeCheckoutBtn.addEventListener('click', e => {
      e.preventDefault();
      this.closeCheckout();
    });

    // close checkout with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      this.closeCheckout();
    });
  }

  addHandlerCartBtns(handler) {
    cartBtn.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
    returnBtn.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  renderSummary(cart) {
    cartContent.innerHTML = '';
    cart.forEach(item => {
      cartContent.insertAdjacentHTML(
        'beforeend',
        `
      <div class="checkout__cart-item" id="${item.id}">
        <figure class="checkout__cart-item--img-wrap">
          <img
            src="${
              document.body.id === 'index' ? '' : '.'
            }./img/placeholder.jpg"
            data-src="${item.image}"
            class="checkout__cart-item--img
            data-color="color-${item.specs.color}"
          />
        </figure>
        <div class="checkout__cart-item--text">
          <a href="#" class="checkout__cart-item--name"
            >${item.title}</a
          >
          <p class="checkout__cart-item--size">${item.specs.size} / ${
          item.specs.color === 'Natural' ? '' : 'Color'
        } ${item.specs.color}</p>
        </div>
        <p class="checkout__cart-item--price">$<span>${item.price}</span></p>
      </div>
      `
      );
    });
  }

  renderInformationSection() {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--information').disabled = true;

    this.parentEle.innerHTML = '';
    this.parentEle.innerHTML = `
    <div class="form__group">
      <h2 class="form__heading">Contactinformation</ h2>
      <div class="form__item">
        <input type="email" id="email" placeholder="Email" required />
        <label for="email"class="form__label">Email</  label>
      </div>
      <div class="form__item">
        <input type="checkbox" id="spam" />
        <label for="spam" class="static"
          >Email me with news and offers</label
        >
      </div>
    </div>
    <div class="form__group">
      <h2 class="form__heading">Shipping address</h2>
      <div class="form__line">
        <div class="form__item">
          <input
            type="text"
            id="fname"
            placeholder="First name"
            required
          />
          <label for="fname" class="form__label">First name</label>
        </div>
        <div class="form__item">
          <input
            type="text"
            id="l-name"
            placeholder="Last name"
            required
          />
          <label for="l-name" class="form__label">Last name</label>
        </div>
      </div>
      <div class="form__item">
        <input type="text" id="address" placeholder="Address" required />
        <label for="address">Address</label>
      </div>
      <div class="form__item">
        <input
          type="text"
          id="suite"
          placeholder="Apartment, suite, etc. (optional)"
        />
        <label for="suite">Apartment, suite, etc. (optional)</label>
      </div>
      <div class="form__line">
        <div class="form__item">
          <input type="text" id="city" placeholder="City" required />
          <label for="city">City</label>
        </div>
        <div class="form__item">
          <input type="text" id="state" placeholder="State" />
          <label for="state">State</label>
        </div>
        <div class="form__item">
          <input type="text" id="zip" placeholder="ZIP code" required />
          <label for="zip">ZIP code</label>
        </div>
      </div>
      <div class="form__item">
        <input type="tel" id="phone" placeholder="Phone (optional)" />
        <label for="phone">Phone (optional)</label>
      </div>
    </div>
      `;
  }

  renderShippingSection() {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--shipping').disabled = true;

    this.parentEle.innerHTML = '';
    this.parentEle.innerHTML = `
      <h1> shipping </h1>
    `;
  }

  renderPaymentSection() {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--payment').disabled = true;

    this.parentEle.innerHTML = '';
    this.parentEle.innerHTML = `
      <h1> payment </h1>
    `;
  }

  // const required = [...document.querySelectorAll('[required]')];
  // console.log(required);
  // const form = document.querySelector('.form__submit');
  // form.addEventListener('click', e => {
  //   required.forEach(ele => {
  //     // e.preventDefault();
  //     ele.classList.add('required');
  //   });
  // });

  addListenerCheckoutNav() {
    checkoutNav.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.checkout__link');
      if (!btn) return;
      if (btn.dataset.content === 'information')
        this.renderInformationSection();
      if (btn.dataset.content === 'shipping') this.renderShippingSection();
      if (btn.dataset.content === 'payment') this.renderPaymentSection();
    });
  }

  // expand.collapse cart summary
  addListenerCartSummary() {
    openSumBtn.addEventListener('click', e => {
      e.preventDefault();
      // if summary is closed
      if (cartContent.classList.contains('closed')) {
        // get all cart items elements
        const cartItems = [
          ...cartContent.querySelectorAll('.checkout__cart-item'),
        ];
        // get their total height
        const height = cartItems[0].offsetHeight * cartItems.length;
        // set css variable to that height
        cartContent.style.setProperty('--cart-height', `${height}px`);
        // remove class name
        cartContent.classList.remove('closed');
        // change btn text content
        openSumBtnText.textContent = '🛒 Hide order summary ↑';
      } else {
        // add class content
        cartContent.classList.add('closed');
        // set css variable
        cartContent.style.setProperty('--cart-height', '0px');
        // change btn text content
        openSumBtnText.textContent = '🛒 Show order summary ↓';
      }
    });
  }
}

export default new CheckoutView();
