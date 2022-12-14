'use strict';

import GeneralView from './generalView.js';

const productModal = document.querySelector('.product-modal');
const closeProductBtn = document.querySelector('.product__close-product');
const cart = document.querySelector('.cart');
const cartCloseBtn = document.querySelector('.cart__close-cart');

class productView extends GeneralView {
  parentEle = document.querySelector('.product');

  renderProductModal(product) {
    // if product only has 1 size option, create special markup for size options
    let sizeOptionsMarkup = ``;
    if (product.id === 1 || product.category === 'electronics') {
      sizeOptionsMarkup = `
        <option value="OS">OS</option>
      `;
      // for regular products create this markup
    } else {
      sizeOptionsMarkup = `
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
        <option value="X-large">X-Large</option>
      `;
    }

    // if product category is jewelery, create special markup for color options and for images
    let colorOptionsMarkup = ``;
    let imagesMarkup = ``;
    if (product.category === 'jewelery') {
      colorOptionsMarkup = `
        <option value="Natural">Natural</option>
      `;
      imagesMarkup = `
        <img
        src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
        alt="${product.title}"
        class="product__img selected solo"
        data-color="natural"
        />
      `;
      // for regular products create this markup
    } else {
      colorOptionsMarkup = `
        <option value="1">Color 1</option>
        <option value="2">Color 2</option>
        <option value="3">Color 3</option>
        <option value="4">Color 4</option>
      `;
      imagesMarkup = `
        <img
        src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
        alt="${product.title}"
        class="product__img selected"
        data-color="color-1"
        />
        <img
        src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
        alt="${product.title}"
        class="product__img"
        data-color="color-2"
        />
        <img
        src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
        alt="${product.title}"
        class="product__img"
        data-color="color-3"
        />
        <img
        src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
        alt="${product.title}"
        class="product__img"
        data-color="color-4"
        />
      `;
    }

    // clean modal inner HTML
    this.parentEle.innerHTML = '';

    // render product's markup
    this.parentEle.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product__slider">
      <div class="product__images"> 
        ${imagesMarkup}
      </div>
      <img
      src="${document.body.id === 'index' ? '' : '.'}./img/placeholder.jpg"
        data-src="${product.image}"
      alt="${product.title}"
      class="product__img product__img--big"
      data-color="color-1"
      />
      <div class="product__slider__btns-wrap">
        <button class="product__slider__btn  product__slider__btn--left" data-dir="-1" aria-label="Scroll gallery to left">
          <i class="las la-arrow-left"></i>
        </ button>
        <button class="product__slider__btn  product__slider__btn--right" data-dir="1" aria-label="Scroll gallery to right">
          <i class="las la-arrow-right"></i>
        </ button>
      </div>
    </div>
    <div class="product__main">
      <div class=""product__main--top>
        <h2 class="product__name">${product.title}</h2>
        <div class="product__price">
          <h3 class="product__price--now">$${product.price}</h3>
          ${
            product.isOnSale
              ? `<h3 class="product__price--before">$${(
                  product.price * 1.5
                ).toFixed(0)}.99</h3>`
              : ''
          }
        </div>
      </div>
      <a href="#" class="product__review" aria-label="Product reviews">
        <div class="product__review--stars">
        </div>
        ${product.rating.count} ${
        product.rating.count === 1 ? 'Review' : 'Reviews'
      }
      </a>

      <div class="product__main--bottom">
        <p class="product__installment">
          Pay in 4 interest-free installments of  <span>$${(
            product.price / 4
          ).toFixed(2)}</span> with
          <img src="${
            document.body.id === 'index' ? '' : '.'
          }./img/shoppay.svg" alt="" /> <a  href="#">Learn more</a>
        </p>

        <form action="" class="product__form">
          <div class="select-wrap">
            <select name="size" id="size"     class="product__size" aria-label="Product size">
              ${sizeOptionsMarkup}
            </select>
          </div>
          <div class="select-wrap">
            <select name="color" id="color"       class="product__color" aria-label="Product color">
              ${colorOptionsMarkup}
            </select>
          </div>
          <div class="qty-wrap">
            <label for="number" aria-label="Product quantity">Qty</label>
            <div class="input-wrap">
              <button type="button"       class="product__change-qty product__minus" aria-label="Decrease product quantity">-</button>
              <input class="product__qty"
                type="number"
                min="1"
                max="10"
                value="1"
                step="1"
                class="product__number"
                id="number"
                aria-label="Enter product quantity"
              />
              <button type="button"   class="product__change-qty product__plus" aria-label="Increase product quantity">+</button>
            </div>
          </div>
        </form>
        <button class="product__add big-btn" aria-label="Add to cart, ${
          product.title
        }">Add to   cart</button>
      </div>
      <p class="product__descr">
        ${product.description}
      </p>
    </div>
    `
    );

    // render correct amount of stars based on product rating
    const rating = Math.round(product.rating.rate);
    for (let i = 0; i < rating; i++) {
      this.parentEle
        .querySelector('.product__review--stars')
        .insertAdjacentHTML('beforeend', '<i class="las la-star"></i>');
    }
  }

  // add event listeners to product quantity btns
  addEventQtyBtns() {
    // select elements
    const formQty = this.parentEle.querySelector('.input-wrap');
    const formQtyInput = this.parentEle.querySelector('.product__qty');
    // add event listener to parent element
    formQty.addEventListener('click', e => {
      // find target
      const target = e.target.closest('.product__change-qty ');
      if (!target) return;
      // decrease quantity
      if (
        target.classList.contains('product__minus') &&
        formQtyInput.value > +formQtyInput.min
      )
        formQtyInput.value--;
      // increase quantity
      else if (
        target.classList.contains('product__plus') &&
        formQtyInput.value < +formQtyInput.max
      )
        formQtyInput.value++;
    });
  }

  addEventAddToCart(handler) {
    // select elements that will trigger add to cart action
    const addToCartBtn = this.parentEle.querySelector('.product__add');
    const form = this.parentEle.querySelector('.product__form');
    const formQtyInput = this.parentEle.querySelector('.product__qty');
    // create function
    const addToCart = e => {
      e.preventDefault();
      // create product properties object
      const specs = {
        size: `${this.parentEle.querySelector('.product__size').value}`,
        color: `${this.parentEle.querySelector('.product__color').value}`,
        qty: +this.parentEle.querySelector('.product__qty').value,
      };
      // run handler
      handler(specs);
    };
    // add listener to "add to cart" btn
    addToCartBtn.addEventListener('click', e => {
      addToCart(e);
    });
    // add listener to form
    form.addEventListener('submit', e => {
      e.preventDefault();
      // guard clause (empty string)
      if (!formQtyInput.value) return;
      addToCart(e);
    });
  }

  addEventImageGallery() {
    // select img wrappers, slider, imgs
    const productImages = this.parentEle.querySelector('.product__images');
    const productImgs = [...productImages.querySelectorAll('.product__img')];
    const productBtns = this.parentEle.querySelector(
      '.product__slider__btns-wrap'
    );
    const productImgBig = this.parentEle.querySelector('.product__img--big');

    // 1) MOBILE GALLERY
    //////////////////////////////

    this.addEventsMobileGallery(
      'product__slider',
      productImages,
      productImgs,
      productBtns
    );

    // 2) DESKTOP GALLERY
    ////////////////////////////////

    productImages.addEventListener('click', e => {
      e.preventDefault();
      // define clicked img
      const clickedImg = e.target.closest('.product__img');
      // guard clause
      if (!clickedImg) return;
      // define color of clicked img
      const clickedImgColor = clickedImg.dataset.color;
      // only continue if clicked img is one of the small ones
      if (
        !clickedImg ||
        window.innerWidth <= 800 ||
        clickedImg.classList.contains('product__img--big')
      )
        return;
      // remove selected class from all imgs
      productImgs.forEach(img => img.classList.remove('selected'));
      // set selected class to clicked img
      clickedImg.classList.add('selected');

      // change color attribute of big img to the color attribute of the clicked img - in real world we would probably change src
      productImgBig.dataset.color = clickedImgColor;
    });
  }

  loadProduct(product, handler) {
    this.renderProductModal(product);
    this.addEventImageGallery();
    this.addEventQtyBtns();
    this.addEventAddToCart(handler);
    this.observeImgs('.product__img');
  }

  addEventCloseProduct() {
    // close product modal
    closeProductBtn.addEventListener('click', e => {
      e.preventDefault();
      productModal.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });

    // close product modal with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close product modal
      productModal.classList.remove('open');
      // return scrolling to body
      document.body.classList.remove('no-scroll');
    });
  }

  closeProductOpenCart() {
    // hide product
    productModal.classList.remove('open');
    // open cart
    cart.classList.add('open');
    //focus cart
    cartCloseBtn.focus();
  }
}

export default new productView();
