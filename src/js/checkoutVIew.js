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
    // enable all nav links
    checkoutNavLinks.forEach(link => (link.disabled = false));
    // disable link to current form
    checkoutNav.querySelector('.checkout__link--information').disabled = true;
    // if the following forms haven't been filled yet, disable links to them
    if (!Object.keys(checkout.information).length)
      document.querySelector('[data-content="shipping"]').disabled = true;
    if (!Object.keys(checkout.shipping).length)
      document.querySelector('[data-content="payment"]').disabled = true;

    // change text of submit and return btns
    submitBtn.innerText = 'Continue to shipping';
    returnBtn.innerHTML = `
      <span><</span>Return to cart
    `;

    // change data-content of form
    this.parentEle.dataset.content = 'information';
    // empty form
    this.parentEle.innerHTML = '';
    // render form
    this.parentEle.innerHTML = `
    <div class="form__group">
      <h2 class="form__heading">Contact information</h2>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="text" id="email"  placeholder="Email"
          value="${checkout.information?.email || ''}"/>
          <label for="email"class="form__label">Email</   label>
        </div>
        <p class="form__error"></p>
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
        <div class="form__item-wrap">
          <div class="form__item">
            <input
              type="text"
              id="firstName"
              placeholder="First name"
            
              value="${checkout.information?.firstName || ''}"
            />
            <label for="firstName"  class="form__label">First name</label>
          </div>
          <p class="form__error"></p>
        </div>    
        <div class="form__item-wrap">
          <div class="form__item">
            <input
              type="text"
              id="lastName"
              placeholder="Last name"
            
              value="${checkout.information?.lastName || ''}"
            />
            <label for="lastName"   class="form__label">Last name</label>
          </div>
          <p class="form__error"></p>
        </div>      
      </div>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="text" id="address"    placeholder="Address" 
          value="${checkout.information?.address || ''} "/>
          <label for="address">Address</label>
        </div>
        <p class="form__error"></p>
      </div>
      <div class="form__item-wrap">
        <div class="form__item">
          <input
            type="text"
            id="suite"
            placeholder="Apartment, suite, etc.   (optional)"
            value="${checkout.information?.suite || ''}"
          />
          <label for="suite">Apartment, suite, etc. (optional)</label>
        </div>
        <p class="form__error"></p>
      </div>      
      <div class="form__line">
        <div class="form__item-wrap">
          <div class="form__item">
            <input type="text" id="city"  placeholder="City" 
            value="${checkout.information?.city || ''}"/>
            <label for="city">City</label>
          </div>
          <p class="form__error"></p>
        </div>
        <div class="form__item-wrap">          
          <div class="form__item">
            <input type="text" id="state"   placeholder="State (optional)" 
            value="${checkout.information?.state || ''}"/ >
            <label for="state">State (optional)</label>
          </div>
          <p class="form__error"></p>
        </div>   
        <div class="form__item-wrap">
          <div class="form__item">
            <input type="text" id="zip" placeholder="ZIP code" 
            value="${checkout.information?.zip || ''}"/>
            <label for="zip">ZIP code</label>
          </div>
          <p class="form__error"></p>
        </div>                               
      </div>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="tel" id="phone"  placeholder="Phone (optional)" 
          value="${checkout.information?.phone || ''}"/>
          <label for="phone">Phone (optional)</label>
        </div>
        <p class="form__error"></p>
      </div>                                   
    </div>
      `;

    // set checkbox according to data saved from last visit (if applicable)
    this.parentEle.querySelector('#spam').checked = checkout.information?.spam;
  }

  renderShippingSection(checkout) {
    // disable all nav links
    checkoutNavLinks.forEach(link => (link.disabled = false));
    // enable link to current form
    checkoutNav.querySelector('.checkout__link--shipping').disabled = true;
    // if following forms haven't been filled in yet, disable links to them
    if (!Object.keys(checkout.shipping).length)
      document.querySelector('[data-content="payment"]').disabled = true;

    // chnage text of submit and return btns
    submitBtn.innerText = 'Continue to payment';
    returnBtn.innerHTML = `
      <span><</span>Return to information
    `;

    // change data-content of form
    this.parentEle.dataset.content = 'shipping';
    // empty form
    this.parentEle.innerHTML = '';
    // render form
    this.parentEle.innerHTML = `
    <div class="form__group">
      <h2 class="form__heading">Shipping method</h2>
      <div class="form__item form__item--radio">
        <input type="radio" id="economy" name="shipping"  value="Economy" data-price="50" checked/>
        <label class="static" for="economy">
          <h5>Economy</h5>
          <span>5 to 8 business days</span>
        </label>
        <strong>$50</strong>
      </div>
      <div class="form__item form__item--radio">
        <input type="radio" id="premium" name="shipping"  value="Premium" data-price="100"/>
        <label class="static" for="premium">
          <h5>Premium</h5>
          <span>1 to 3 business days</span>
        </label>
        <strong>$100</strong>
      </div>
    </div>
    `;

    // check correct option based on previous visits (if applicable)
    if (!checkout.shipping.type) return;
    this.parentEle.querySelector(
      `input[value="${checkout.shipping.type}"]`
    ).checked = true;
  }

  renderPaymentSection() {
    // enable all nav links
    checkoutNavLinks.forEach(link => (link.disabled = false));
    // disable link to current form
    checkoutNav.querySelector('.checkout__link--payment').disabled = true;

    // change text of submit and return btns
    submitBtn.innerText = 'Pay now';
    returnBtn.innerHTML = `
      <span><</span>Return to shipping
    `;

    // change data-content of form
    this.parentEle.dataset.content = 'payment';
    // empty form
    this.parentEle.innerHTML = '';
    // render form
    this.parentEle.innerHTML = `
    <div class="form__group">
      <h2 class="form__heading">Discount code</h2>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="text" id="discount"    placeholder="Discount code"/>
          <label  for="discount"class="form__label">Discount   code</label>
          <button type="button">→</button>
        </div>
        <p class="form__error"></p>
      </div>  
    </div>
    <div class="form__group">
      <h2 class="form__heading">Payment</h2>
      <p>No transactions will take place, this is just a fake eshop :)</p>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="number" id="card-number"   placeholder="Card number" />
          <label for="card-number" class="form__label">Card number</label>
        </div>
        <p class="form__error"></p>
      </div>   
      <div class="form__item-wrap"> 
        <div class="form__item">
          <input type="text" id="card-holder"   placeholder="Card holder" />
          <label  for="card-holder"class="form__label">Card holder</label>
        </div>
        <p class="form__error"></p>
      </div> 
      <div class="form__item-wrap">     
        <div class="form__item">
          <input type="text" id="card-exp"  name="card-exp-month" placeholder="Expiration date (MM / YY)" />
          <label  for="card-exp"class="form__label">Expiration   date (MM / YY)
          </label>
        </div>
        <p class="form__error"></p>
      </div>   
      <div class="form__item-wrap">     
        <div class="form__item">
          <input type="number" id="card-code"   placeholder="Security code" />
          <label  for="card-code"class="form__label">Security code
          </label>
        </div>
        <p class="form__error"></p>
      </div>     
    </div>
    `;

    // create regular expressions
    const regDigit = /^[0-9]$/; // digits only
    const regDigitSlash = /^[0-9/]$/; // digits and "/" only

    // control card number field
    const cardNumber = this.parentEle.querySelector('#card-number');
    cardNumber.addEventListener('keypress', e => {
      // only allow 16 digits
      if (
        (!regDigit.test(e.key) || cardNumber.value.length >= 16) &&
        // allow pressing enter
        e.key !== 'Enter'
      )
        e.preventDefault();
    });

    //control card holder field
    const cardHolder = this.parentEle.querySelector('#card-holder');
    cardHolder.addEventListener('keypress', e => {
      // prevent from typing digits
      if (regDigit.test(e.key)) e.preventDefault();
    });

    // control card expiry date field
    const cardExp = this.parentEle.querySelector('#card-exp');
    cardExp.addEventListener('keypress', e => {
      // allow only digits and "/" and 5 chars total
      if (
        (!regDigitSlash.test(e.key) || cardExp.value.length >= 5) &&
        // allow pressing enter
        e.key !== 'Enter'
      )
        e.preventDefault();
    });

    // control card code field
    const cardCode = this.parentEle.querySelector('#card-code');
    cardCode.addEventListener('keypress', e => {
      // only allow 3 digits
      if (
        (!regDigit.test(e.key) || cardCode.value.length >= 3) &&
        // allow pressing enter
        e.key !== 'Enter'
      )
        e.preventDefault();
    });
  }

  // set events to checkout nav links
  addHandlerCheckoutNav(handler, checkout) {
    checkoutNav.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.checkout__link');
      if (!btn) return;
      if (btn.dataset.content === 'cart') handler();
      if (btn.dataset.content === 'information')
        this.renderInformationSection(checkout);
      if (btn.dataset.content === 'shipping')
        this.renderShippingSection(checkout);
      if (btn.dataset.content === 'payment') this.renderPaymentSection();
    });
  }

  // set event on return btn under form
  addHandlerReturnBtn(handler, checkout) {
    returnBtn.addEventListener('click', e => {
      e.preventDefault();
      if (this.parentEle.dataset.content === 'information') handler();
      else if (this.parentEle.dataset.content === 'shipping')
        this.renderInformationSection(checkout);
      else if (this.parentEle.dataset.content === 'payment')
        this.renderShippingSection(checkout);
    });
  }

  validateForm(section) {
    // set variable
    let success = true;

    // INFORMATION SECTION
    if (section === 'information') {
      // select input fields
      const email = this.parentEle.querySelector('#email');
      const firstName = this.parentEle.querySelector('#firstName');
      const lastName = this.parentEle.querySelector('#lastName');
      const address = this.parentEle.querySelector('#address');
      const city = this.parentEle.querySelector('#city');
      const zip = this.parentEle.querySelector('#zip');

      // perform validation - if condition test fails, run setInputError function on given element, else run setInputSuccess function on it

      // empty email
      if (email.value.trim() === '') {
        this.setInputError(email, 'Please enter email address');
        success = false;
        // invalid email form - basic regex to check for "string@string.string" form
      } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        this.setInputError(email, 'Please enter a valid email address');
        success = false;
        // correct email
      } else this.setInputSuccess(email);

      // empty first name
      if (firstName.value.trim() === '') {
        this.setInputError(firstName, 'Please enter first name');
        success = false;
        // correct first name
      } else this.setInputSuccess(firstName);

      // empty last name
      if (lastName.value.trim() === '') {
        this.setInputError(lastName, 'Please enter last name');
        success = false;
      } // correct last name
      else this.setInputSuccess(lastName);

      // empty address
      if (address.value.trim() === '') {
        this.setInputError(address, 'Please enter address');
        success = false;
      } // correct address
      else this.setInputSuccess(address);

      // empty city
      if (city.value.trim() === '') {
        this.setInputError(city, 'Please enter city name');
        success = false;
      } // correct city
      else this.setInputSuccess(city);

      // empty zip
      if (zip.value.trim() === '') {
        this.setInputError(zip, 'Please enter ZIP code');
        success = false;
      } // correct zip
      else this.setInputSuccess(zip);
    }

    // PAYMENTS SECTION
    else if (section === 'payment') {
      // select input fields
      const cardNumber = this.parentEle.querySelector('#card-number');
      const cardHolder = this.parentEle.querySelector('#card-holder');
      const cardExp = this.parentEle.querySelector('#card-exp');
      const cardCode = this.parentEle.querySelector('#card-code');

      // perform validation - if condition test fails, run setInputError function on given element, else run setInputSuccess function on it

      // empty card number
      if (cardNumber.value.trim() === '') {
        this.setInputError(cardNumber, 'Please enter card number');
        success = false;
      }
      // invalid card number
      else if (cardNumber.value.length < 16) {
        this.setInputError(cardNumber, 'Please enter valid card number');
        success = false;
        // correct card number
      } else this.setInputSuccess(cardNumber);

      // empty card name
      if (cardHolder.value.trim() === '') {
        this.setInputError(cardHolder, 'Please enter card holder name');
        success = false;
        // correct card holder
      } else this.setInputSuccess(cardHolder);

      // empty card exp date
      if (cardExp.value.trim() === '') {
        this.setInputError(cardExp, 'Please enter card expiry date');
        success = false;
      }
      // invalid card exp date
      else if (!/^\d\d\/\d\d$/.test(cardExp.value.trim())) {
        this.setInputError(
          cardExp,
          'Please enter valid card expiry date (MM/YY)'
        );
        success = false;
        // correct card exp date
      } else this.setInputSuccess(cardExp);

      // empty card code
      if (cardCode.value.trim() === '') {
        this.setInputError(cardCode, 'Please enter card security code');
        success = false;
      }
      // invalid card code
      else if (cardCode.value.length < 3) {
        this.setInputError(cardCode, 'Please enter valid card security code');
        success = false;
        // correct card code
      } else this.setInputSuccess(cardCode);
    }
    // if there are errors
    if (!success) {
      // find the first one and scroll to it
      this.parentEle
        .querySelector('.error')
        .scrollIntoView({ behavior: 'smooth' });
      // and focus input field
      this.parentEle.querySelector('.error').querySelector('input').focus();
    }
    // return success variable
    return success;
  }

  setInputError(ele, msg) {
    // select given elements parent's parent
    const inputWrap = ele.parentElement.parentElement;
    // select it's error msg ele
    const errorMsg = inputWrap.querySelector('.form__error');
    // set error msg
    errorMsg.innerHTML = `${msg}`;
    // change styles by adding/removing classes
    inputWrap.classList.add('error');
    inputWrap.classList.remove('success');
  }

  setInputSuccess(ele) {
    // select given elements parent's parent
    const inputWrap = ele.parentElement.parentElement;
    // select it's error msg ele
    const errorMsg = inputWrap.querySelector('.form__error');
    // empty error msg
    errorMsg.innerHTML = '';
    // change styles by adding/removing classes
    inputWrap.classList.add('success');
    inputWrap.classList.remove('error');
  }

  // set events on submitting form
  addHandlerSubmitForm(handler, checkout) {
    checkoutForm.addEventListener('submit', e => {
      // prevent default submitting
      e.preventDefault();
      // if the current form is information section
      if (this.parentEle.dataset.content === 'information') {
        // validate form input fields, if there are any errors, return
        if (!this.validateForm('information')) return;
        // create object from form data
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
        // run handler with section name and new object
        handler('information', information);
        // render next form
        this.renderShippingSection(checkout);
        // if the current form is shipping section
      } else if (this.parentEle.dataset.content === 'shipping') {
        // create object from form data
        const shipping = {
          type: `${
            this.parentEle.querySelector('[name="shipping"]:checked').value
          }`,
          price: `${
            this.parentEle.querySelector('[name="shipping"]:checked').dataset
              .price
          }`,
        };
        // run handler with section name and new object
        handler('shipping', shipping);
        // render next form
        this.renderPaymentSection();
        // if the current form is payment section
      } else if (this.parentEle.dataset.content === 'payment') {
        // validate form input fields, if there are any errors, return
        if (!this.validateForm('payment')) return;

        // create object from form data
        const payment = {
          cardNumber: '12345678',
          cardExpiry: '12/22',
          cvv: '123',
          name: 'Frantisek Balambamba',
        };
        // run handler with section name and new object
        handler('payment', payment);
        // run complete order function - not created yet
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
