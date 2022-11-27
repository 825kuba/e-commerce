'use strict';

import GeneralView from './generalView.js';

const checkoutEle = document.querySelector('.checkout');
const closeCheckoutBtn = document.querySelector('.checkout__close-checkout');
const checkoutNav = document.querySelector('.checkout__nav');
const checkoutNavLinksEle = document.querySelector('.checkout__links');
const checkoutNavLinks = [...checkoutNav.querySelectorAll('.checkout__link')];
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

  renderSummary(cart, checkout, discountHandler) {
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
          <h5class="checkout__cart-item--name"
            >${item.title}</h5
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

    // calculate prices
    const pricing = this.updateSummaryPrice(checkout);

    // update btn price text
    openSumBtnPrice.innerText = pricing.total.toFixed(2);

    // render subtotal section
    cartContent.insertAdjacentHTML(
      'beforeend',
      `
      <div class="checkout__details">
        <form action="" class="checkout__detail checkout__detail--form">
            <div class="form__item-wrap">
              <div class="form__item">
                <input type="text" id="discount"  placeholder="Discount code" value="${
                  checkout.discount.code || ''
                }" />
                <label for="discount"   class="form__label">Discount code</label>
                <button type="submit">Apply</button>
              </div>
              <p class="form__error"></p>
            </div>
        </form>
        <div class="checkout__detail checkout__detail--subtotal">
          <div class="checkout__detail--line" id="subtotal-line">
            <h6>Subtotal</h6>
            <strong>$<span>${pricing.subtotal.toFixed(2)}</span></strong>
          </div>
          <div class="checkout__detail--line" id="shipping-line">
            <h6>Shipping</h6>
            <strong>$<span>${pricing.shipping.toFixed(2)}</span></strong>
          </div>
          <div class="checkout__detail--line ${
            checkout.discount.code ? '' : 'hidden'
          }" id="discount-line">
            <h6>Discount</h6>
            <strong>- $<span>${
              checkout.discount.code ? pricing.discount.toFixed(2) : 0
            } (${checkout.discount.perc || 0} OFF)</span></strong>
          </div>
        </div>
        <div class="checkout__detail checkout__detail--total">
          <div class="checkout__detail--line" id="total-line">
            <h5>Total</h5>
            <strong class="total">$<span>${pricing.total.toFixed(
              2
            )}</span></strong>
          </div>
        </div>
      </div>
      `
    );

    // select discount code form
    const discountForm = cartContent.querySelector('.checkout__detail--form');
    const discountInput = cartContent.querySelector('#discount');

    // add event on submit
    discountForm.addEventListener('submit', e => {
      e.preventDefault();
      // run handler
      discountHandler(discountInput.value, discountInput);
    });

    // adjust summary height
    this.calcSummaryHeight();
    // observe Imgs
    this.observeImgs('.checkout__cart-item--img');
  }

  updateSummaryPrice(checkout) {
    // update shipping price
    const shippingPrice = Number(checkout.shipping.price) || 0;

    // update subtotal price
    const subtotalPrice = checkout.details.subtotal;

    // calculate total price
    let totalPrice = subtotalPrice + shippingPrice;

    // calculate discount amount
    const discountAmount = checkout.discount.amount
      ? totalPrice * checkout.discount.amount
      : 0;

    // update total price
    totalPrice = totalPrice - discountAmount;

    // return object with prices
    return {
      subtotal: subtotalPrice,
      shipping: shippingPrice,
      discount: discountAmount,
      total: totalPrice,
    };
  }

  // udpate (render again) prices lines and btn price text
  updatePrices(checkout) {
    // calculate prices
    const pricing = this.updateSummaryPrice(checkout);

    // subtotal line
    cartContent
      .querySelector('#subtotal-line')
      .querySelector('span').innerHTML = `${pricing.subtotal.toFixed(2)}`;

    // shipping line
    cartContent
      .querySelector('#shipping-line')
      .querySelector('span').innerHTML = `${pricing.shipping.toFixed(2)}`;

    // discount line
    cartContent
      .querySelector('#discount-line')
      .querySelector('span').innerHTML = `${
      checkout.discount.code ? pricing.discount.toFixed(2) : 0
    } (${checkout.discount.perc ? checkout.discount.perc : 0} OFF)`;

    // total price
    cartContent
      .querySelector('#total-line')
      .querySelector('span').innerHTML = `${pricing.total.toFixed(2)}`;

    // btn price text
    openSumBtnPrice.innerText = pricing.total.toFixed(2);
  }

  calcSummaryHeight() {
    // get all cart items elements
    const cartItems = [...cartContent.querySelectorAll('.checkout__cart-item')];
    if (!cartItems.length) return;
    // get their total height + checkout__details container height
    const height =
      cartItems[0].offsetHeight * cartItems.length +
      document.querySelector('.checkout__details').offsetHeight;
    // set css variable to that height
    cartContent.style.setProperty('--cart-height', `${height}px`);
    // get number of gaps between flex items - cartItems.length is perfect because the 1 extra gap is for the details element
    const cartGaps = cartItems.length;
    // set css variable to that number
    cartContent.style.setProperty('--cart-gaps', `${cartGaps}`);
  }

  openSummary() {
    // calc summary height
    this.calcSummaryHeight();
    // remove class name
    cartContent.classList.remove('closed');
    // change btn text content
    openSumBtnText.textContent = '🛒 Hide order summary ↑';
  }

  closeSummary() {
    // add class content
    cartContent.classList.add('closed');
    // set css variable
    cartContent.style.setProperty('--cart-height', '0px');
    // change btn text content
    openSumBtnText.textContent = '🛒 Show order summary ↓';
  }

  // expand / collapse cart summary
  addListenerCartSummary() {
    openSumBtn.addEventListener('click', e => {
      e.preventDefault();
      // if summary is closed
      if (cartContent.classList.contains('closed')) this.openSummary();
      // if it is opened
      else this.closeSummary();
    });
  }

  // show discount line
  showDiscount() {
    cartContent.querySelector('#discount-line').classList.remove('hidden');
  }

  // hide discount line
  hideDiscount() {
    cartContent.querySelector('#discount-line').classList.add('hidden');
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

    // scroll to top
    checkoutEle.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // close summary
    this.closeSummary();

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
      <div class="form__item form__item--checkbox">
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

    // scroll to top
    checkoutEle.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // close summary
    this.closeSummary();

    // change data-content of form
    this.parentEle.dataset.content = 'shipping';
    // empty form
    this.parentEle.innerHTML = '';
    // render form
    this.parentEle.innerHTML = `
    <div class="form__group form__group--border" id="change-form">
      <div class="form__item form__item--change">
        <p>
          <span>Contact</span>
          <button type="button" class="btn-sm" id="change-btn" data-content="information">Change</button>
        </p>
        <span>${checkout.information.email}</span>
        <span>${checkout.information.phone}</span>
      </div>
      <div class="form__item form__item--change">
        <p>
          <span>Ship to</span>
          <button type="button" class="btn-sm" id="change-btn" data-content="information">Change</button>
        </p>
        <span>${checkout.information.address}, ${checkout.information.suite}${
      checkout.information.suite ? ',' : ''
    } ${checkout.information.city}, ${checkout.information.state}${
      checkout.information.state ? ',' : ''
    } ${checkout.information.zip}
        </span>
      </div>
    </div>
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

    // add listener to change btns
    this.addListenerChangeBtns(checkout);

    // check correct option based on previous visits (if applicable)
    if (!checkout.shipping.type) return;
    this.parentEle.querySelector(
      `input[value="${checkout.shipping.type}"]`
    ).checked = true;
  }

  renderPaymentSection(checkout) {
    // enable all nav links
    checkoutNavLinks.forEach(link => (link.disabled = false));
    // disable link to current form
    checkoutNav.querySelector('.checkout__link--payment').disabled = true;

    // change text of submit and return btns
    submitBtn.innerText = 'Pay now';
    returnBtn.innerHTML = `
      <span><</span>Return to shipping
    `;

    // scroll to top
    checkoutEle.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // close summary
    this.closeSummary();

    // change data-content of form
    this.parentEle.dataset.content = 'payment';
    // empty form
    this.parentEle.innerHTML = '';
    // render form
    this.parentEle.innerHTML = `
    <div class="form__group form__group--border" id="change-form">
      <div class="form__item form__item--change">
        <p>
          <span>Contact</span>
          <button type="button" class="btn-sm" id="change-btn" data-content="information">Change</button>
        </p>
        <span>${checkout.information.email}</span>
        <span>${checkout.information.phone}</span>
      </div>
      <div class="form__item form__item--change">
        <p>
          <span>Ship to</span>
          <button type="button" class="btn-sm" id="change-btn" data-content="information">Change</button>
        </p>
        <span>${checkout.information.address}, ${checkout.information.suite}${
      checkout.information.suite ? ',' : ''
    } ${checkout.information.city}, ${checkout.information.state}${
      checkout.information.state ? ',' : ''
    } ${checkout.information.zip}
        </span>
      </div>
      <div class="form__item form__item--change">
        <p>
          <span>Method</span>
          <button type="button" class="btn-sm" id="change-btn" data-content="shipping">Change</button>
        </p>
        <span>${checkout.shipping.type} - <strong>$${
      checkout.shipping.price
    }</strong>
        </span>
      </div>
    </div>
    <div class="form__group">
      <h2 class="form__heading">Payment</h2>
      <p>No transactions will take place, this is just a fake e-shop :)</p>
      <div class="form__item-wrap">
        <div class="form__item">
          <input type="number" id="card-number"   placeholder="Card number" value="${
            checkout.payment?.cardNumber || ''
          }"/>
          <label for="card-number" class="form__label">Card number</label>
        </div>
        <p class="form__error"></p>
      </div>   
      <div class="form__item-wrap"> 
        <div class="form__item">
          <input type="text" id="card-holder"   placeholder="Card holder" value="${
            checkout.payment?.cardHolder || ''
          }"/>
          <label  for="card-holder"class="form__label">Card holder</label>
        </div>
        <p class="form__error"></p>
      </div> 
      <div class="form__item-wrap">     
        <div class="form__item">
          <input type="text" id="card-exp"  name="card-exp-month" placeholder="Expiration date (MM / YY)" 
          value="${checkout.payment?.cardExpiry || ''}"
          />
          <label  for="card-exp"class="form__label">Expiration   date (MM / YY)
          </label>
        </div>
        <p class="form__error"></p>
      </div>   
      <div class="form__item-wrap">     
        <div class="form__item">
          <input type="number" id="card-code"   placeholder="Security code" value="${
            checkout.payment?.cardCode || ''
          }"/>
          <label  for="card-code"class="form__label">Security code
          </label>
        </div>
        <p class="form__error"></p>
      </div>     
    </div>
    <div class="form__group">
      <h2 class="form__heading">Remember me</h2>
      <div class="form__item form__item--checkbox form__item--border">
        <input type="checkbox" id="save"/>
        <label for="save" class="static"
          >Save my information for a faster checkout</ label
        >
      </div>
    </div>
    `;

    // check correct option based on previous visits (if applicable)
    if (checkout.payment?.save) {
      this.parentEle.querySelector(`#save`).checked = checkout.payment.save;
    }

    // add listener to change btns
    this.addListenerChangeBtns(checkout);

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
      // set target btn
      const btn = e.target.closest('.checkout__link');
      // only proceed if btn is clicked
      if (!btn) return;
      // cart btn
      if (btn.dataset.content === 'cart') handler();
      // info btn
      if (btn.dataset.content === 'information')
        this.renderInformationSection(checkout);
      // shipping btn
      if (btn.dataset.content === 'shipping')
        this.renderShippingSection(checkout);
      // payment btn
      if (btn.dataset.content === 'payment')
        this.renderPaymentSection(checkout);
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

  addListenerChangeBtns(checkout) {
    document.querySelector('#change-form').addEventListener('click', e => {
      console.log('clicked on form group');
      const btn = e.target.closest('#change-btn');
      if (!btn) return;
      // render information section
      if (btn.dataset.content === 'information')
        this.renderInformationSection(checkout);
      // render shipping section
      if (btn.dataset.content === 'shipping')
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
  addHandlerSubmitForm(formHandler, checkout) {
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
        // run formHandler with section name and new object
        formHandler('information', information);
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
          text: `${
            this.parentEle
              .querySelector('[name="shipping"]:checked')
              .parentElement.querySelector('label')
              .querySelector('span').innerText
          }`,
        };
        // run formHandler with section name and new object
        formHandler('shipping', shipping);
        // render next form
        this.renderPaymentSection(checkout);
        // update prices in case shipping price changes
        this.updatePrices(checkout);

        // if the current form is payment section
      } else if (this.parentEle.dataset.content === 'payment') {
        // validate form input fields, if there are any errors, return
        if (!this.validateForm('payment')) return;

        // create object from form data
        const payment = {
          cardNumber: `${this.parentEle.querySelector('#card-number').value}`,
          cardExpiry: `${this.parentEle.querySelector('#card-exp').value}`,
          cardCode: `${this.parentEle.querySelector('#card-code').value}`,
          cardHolder: `${this.parentEle.querySelector('#card-holder').value}`,
          save: this.parentEle.querySelector('#save').checked,
        };
        // show "order completed" message
        this.renderFinishCheckout(checkout);
        // run formHandler with section name and new object - this will empty cart and if chosen also customer info
        formHandler('payment', payment);

        // if the current content is checkout completed message
      } else if (this.parentEle.dataset.content === 'checkout-completed') {
        // reload window
        window.location.reload();
      }
    });
  }

  renderFinishCheckout(checkout) {
    // change dataset attribute
    this.parentEle.dataset.content = 'checkout-completed';

    // hide elements
    // close btn
    closeCheckoutBtn.classList.add('hidden');
    // nav
    checkoutNavLinksEle.classList.add('hidden');
    // return btn
    returnBtn.classList.add('hidden');
    // discount code input field
    cartContent
      .querySelector('.checkout__detail--form')
      .classList.add('hidden');

    // change text of submit btn
    submitBtn.innerText = 'Continue shopping';

    // scroll to top
    checkoutEle.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // close summary
    this.closeSummary();

    // render final message
    this.parentEle.innerHTML = `
      <div class="form__group success">
        <h2 class="form__heading">Thank you!</h2>
        <h2 class="form__heading form__heading--sm">
          We have recieved your payment of <strong>${
            document.querySelector('#total-line').querySelector('.total')
              .innerHTML
          }</strong>
        </h2>
      </div>
      <div class="form__group">
        <h2 class="form__heading form__heading--sm">
        It will be delivered to:
        </h2>
        <address>
          ${checkout.information.firstName}
          ${checkout.information.lastName}<br>
          ${checkout.information.address}<br>
          ${checkout.information.suite}<br>
          ${checkout.information.city}<br>
          ${checkout.information.state}<br>
          ${checkout.information.zip}<br>
        </address>
      </div>
      <div class="form__group">
        <h2 class="form__heading form__heading--sm">
        Your contact information:
        </h2>
        <strong>
          ${checkout.information.phone}<br>
          ${checkout.information.email}<br>
        </strong>
      </div>
      <div class="form__group">
        <h2 class="form__heading form__heading--sm">
        Estimated delivery time:
        </h2>
        <strong>
          ${checkout.shipping.text}
        </strong>
      </div>
    `;

    // render instructions for seller - if there are any
    if (checkout.instructions === '') return;
    this.parentEle.insertAdjacentHTML(
      'beforeend',
      `
      <div class="form__group">
        <h2 class="form__heading form__heading--sm">
        Instructions for seller:
        </h2>
        <strong>
          ${checkout.instructions}
        </strong>
      </div>    `
    );
  }
}

export default new CheckoutView();
