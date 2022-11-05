'use strict';

import GeneralView from './generalView.js';

const checkoutEle = document.querySelector('.checkout');
const closeCheckoutBtn = document.querySelector('.checkout__close-checkout');
const checkoutNav = document.querySelector('.checkout__nav');
const checkoutNavLinks = [...checkoutNav.querySelectorAll('.checkout__link')];
// const cartBtn = document.querySelector('.checkout__link--cart');
const checkoutForm = document.querySelector('.checkout__content');
const returnBtn = document.querySelector('.form__return');
const submitBtn = document.querySelector('.form__submit');
const openSumBtn = document.querySelector('.checkout__summary-btn');
const openSumBtnText = document.querySelector('.checkout__summary-btn--text');
const openSumBtnPrice = document.querySelector(
  '.checkout__summary-btn--price span'
);
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

  // addHandlerCartBtns(handler) {
  //   cartBtn.addEventListener('click', e => {
  //     e.preventDefault();
  //     handler();
  //   });
  //   returnBtn.addEventListener('click', e => {
  //     e.preventDefault();
  //     handler();
  //   });
  // }

  renderSummary(cart) {
    cartContent.innerHTML = '';
    cart.forEach(item => {
      cartContent.insertAdjacentHTML(
        'beforeend',
        `
      <div class="checkout__cart-item" id="${item.id}">
        <figure class="checkout__cart-item--img-wrap">
          <span class="checkout__cart-item--qty">${item.specs.qty}</span>
          <img
            src="${
              document.body.id === 'index' ? '' : '.'
            }./img/placeholder.jpg"
            data-src="${item.image}"
            class="checkout__cart-item--img"
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
        <p class="checkout__cart-item--price">$<span>${item.price.toFixed(
          2
        )}</span></p>
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
    openSumBtnPrice.innerText = totalPrice.toFixed(2);
  }

  renderInformationSection(checkout) {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--information').disabled = true;

    submitBtn.innerText = 'Continue to shipping';
    returnBtn.innerHTML = `
      <span><</span>Return to cart
    `;

    this.parentEle.dataset.content = 'information';
    this.parentEle.innerHTML = '';
    this.parentEle.innerHTML = `
    <div class="form__group">
      <h2 class="form__heading">Contact information</h2>
      <div class="form__item">
        <input type="email" id="email" placeholder="Email" required
        value="${checkout.information?.email || ''}"/>
        <label for="email"class="form__label">Email</  label>
      </div>
      <div class="form__item">
        <input type="checkbox" id="spam"/>
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
            id="firstName"
            placeholder="First name"
            required
            value="${checkout.information?.firstName || ''}"
          />
          <label for="firstName" class="form__label">First name</label>
        </div>
        <div class="form__item">
          <input
            type="text"
            id="lastName"
            placeholder="Last name"
            required
            value="${checkout.information?.lastName || ''}"
          />
          <label for="lastName" class="form__label">Last name</label>
        </div>
      </div>
      <div class="form__item">
        <input type="text" id="address" placeholder="Address" required 
        value="${checkout.information?.address || ''}"/>
        <label for="address">Address</label>
      </div>
      <div class="form__item">
        <input
          type="text"
          id="suite"
          placeholder="Apartment, suite, etc. (optional)"
          value="${checkout.information?.suite || ''}"
        />
        <label for="suite">Apartment, suite, etc. (optional)</label>
      </div>
      <div class="form__line">
        <div class="form__item">
          <input type="text" id="city" placeholder="City" required 
          value="${checkout.information?.city || ''}"/>
          <label for="city">City</label>
        </div>
        <div class="form__item">
          <input type="text" id="state" placeholder="State" 
          value="${checkout.information?.state || ''}"/>
          <label for="state">State</label>
        </div>
        <div class="form__item">
          <input type="text" id="zip" placeholder="ZIP code" required 
          value="${checkout.information?.zip || ''}"/>
          <label for="zip">ZIP code</label>
        </div>
      </div>
      <div class="form__item">
        <input type="tel" id="phone" placeholder="Phone (optional)" 
        value="${checkout.information?.phone || ''}"/>
        <label for="phone">Phone (optional)</label>
      </div>
    </div>
      `;

    this.parentEle.querySelector('#spam').checked = checkout.information?.spam;
  }

  renderShippingSection() {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--shipping').disabled = true;

    submitBtn.innerText = 'Continue to payment';
    returnBtn.innerHTML = `
      <span><</span>Return to information
    `;

    this.parentEle.dataset.content = 'shipping';
    this.parentEle.innerHTML = '';
    this.parentEle.innerHTML = `
      <h1> shipping </h1>
    `;
  }

  renderPaymentSection() {
    checkoutNavLinks.forEach(link => (link.disabled = false));
    checkoutNav.querySelector('.checkout__link--payment').disabled = true;

    submitBtn.innerText = 'Pay now';
    returnBtn.innerHTML = `
      <span><</span>Return to shipping
    `;

    this.parentEle.dataset.content = 'payment';
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

  addHandlerCheckoutNav(handler, checkout) {
    checkoutNav.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.checkout__link');
      if (!btn) return;
      if (btn.dataset.content === 'cart') handler();
      if (btn.dataset.content === 'information')
        this.renderInformationSection(checkout);
      if (btn.dataset.content === 'shipping') this.renderShippingSection();
      if (btn.dataset.content === 'payment') this.renderPaymentSection();
    });
  }

  addHandlerReturnBtn(handler, checkout) {
    returnBtn.addEventListener('click', e => {
      e.preventDefault();
      if (this.parentEle.dataset.content === 'information') handler();
      else if (this.parentEle.dataset.content === 'shipping')
        this.renderInformationSection(checkout);
      else if (this.parentEle.dataset.content === 'payment')
        this.renderShippingSection();
    });
  }

  addHandlerSubmitForm(handler) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      if (this.parentEle.dataset.content === 'information') {
        const information = {
          email: `${this.parentEle.querySelector('#email').value}`,
          spam: this.parentEle.querySelector('#spam').checked,
          firstName: `${this.parentEle.querySelector('#firstName').value}`,
          lastName: `${this.parentEle.querySelector('#lastName').value}`,
          address: `${this.parentEle.querySelector('#address').value}`,
          suite: `${this.parentEle.querySelector('#suite').value}`,
          city: `${this.parentEle.querySelector('#city').value}`,
          state: `${this.parentEle.querySelector('#state').value}`,
          zip: `${this.parentEle.querySelector('#zip').value}`,
          phone: `${this.parentEle.querySelector('#phone').value}`,
        };
        handler('information', information);
        this.renderShippingSection();
      } else if (this.parentEle.dataset.content === 'shipping') {
        const shipping = {
          type: 'Economy',
          price: '120',
        };
        handler('shipping', shipping);
        this.renderPaymentSection();
      } else if (this.parentEle.dataset.content === 'payment') {
        const payment = {
          cardNumber: '12345678',
          cardExpiry: '12/22',
          cvv: '123',
          name: 'Frantisek Balambamba',
        };
        handler('payment', payment);
        console.log('end session');
      }
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
        // get number of cart items minus 1 - that gives us number of gaps between cart items;
        const cartGaps = cartItems.length - 1;
        // set css variable to that number
        cartContent.style.setProperty('--cart-gaps', `${cartGaps}`);
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
