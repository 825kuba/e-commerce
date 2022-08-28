'use strict';

const productsContainer = document.querySelector('.products__container');
const productModal = document.querySelector('.product-modal');
const productEle = document.querySelector('.product');

class productsView {
  renderProductsByCategory(products) {
    // clear parent element
    productsContainer.innerHTML = '';
    // loop through products and render them
    // first 2 products loaded as "on sale"
    products.forEach((product, i) => {
      productsContainer.insertAdjacentHTML(
        'beforeend',
        `
          <div class="products__product" id="${product.id}">
            ${i > 1 ? '' : '<span class="products__badge">on sale</span>'}
            <img
              src="${product.image}"
              alt="${product.title}"
              class="products__img"
            />
            <h5 class="products__name">${product.title}</h5>
            <p class="products__price">
              <span class="products__price--now">$${product.price}
              </span>
              ${
                i > 1
                  ? ''
                  : `<span class="products__price--before">$${(
                      product.price * 1.5
                    ).toFixed(0)}.99</span>`
              }
            </p>
          </div> 
        `
      );
    });
  }

  // add event listener to every product
  addEventListenerToProduct(handler) {
    // guard clause for landing page
    if (!productsContainer) return;
    // on click
    productsContainer.addEventListener('click', e => {
      // get the product element
      const target = e.target.closest('.products__product');
      // if no target return
      if (!target) return;
      console.log(target);
      productModal.classList.add('open');
      document.body.classList.add('no-scroll');
      handler(target);
    });
  }

  renderProductModal(product) {
    // clean modal inner HTML
    productEle.innerHTML = '';

    productEle.insertAdjacentHTML(
      'beforeend',
      `
    <div class="product__slider">
      <div class="product__images">  
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--90deg"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--180deg"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--270deg"
        />
      </div>
      <div class="product__slider-btns-wrap">
        <button class="product__slider-btn  product__slider-btn--left" data-dir="-1">
          <i class="las la-arrow-left"></i>
        </ button>
        <button class="product__slider-btn  product__slider-btn--right" data-dir="1">
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
      <a href="#" class="product__review">
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
          <img src="../img/shoppay.svg" alt="" /> <a  href="#">Learn more</a>
        </p>

        <form action="#" class="product__form">
          <div class="select-wrap">
            <select name="size" id="size"     class="product__size">
              <option value="s">Small</option>
              <option value="m">Medium</option>
              <option value="l">Large</option>
              <option value="xl">X-Large</option>
            </select>
          </div>
          <div class="select-wrap">
            <select name="color" id="color"       class="product__color">
              <option value="1">Color 1</option>
              <option value="2">Color 2</option>
              <option value="3">Color 3</option>
              <option value="4">Color 4</option>
            </select>
          </div>
          <div class="qty-wrap">
            <label for="number">Qty</label>
            <div class="input-wrap">
              <button type="button"       class="product__change-qty product__minus">-</button>
              <input class="product__qty"
                type="number"
                min="1"
                max="10"
                value="1"
                class="product__number"
                id="number"
              />
              <button type="button"   class="product__change-qty product__plus">+</button>
            </div>
          </div>
        </form>
        <button class="product__add big-btn">Add to   cart</button>
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
      document
        .querySelector('.product__review--stars')
        .insertAdjacentHTML('beforeend', '<i class="las la-star"></i>');
    }

    // add event listeners to form btns
    const formQty = document.querySelector('.input-wrap');
    const formQtyInput = document.querySelector('.product__qty');

    formQty.addEventListener('click', e => {
      const target = e.target.closest('.product__change-qty ');
      if (!target) return;
      if (
        target.classList.contains('product__minus') &&
        formQtyInput.value > +formQtyInput.min
      )
        formQtyInput.value--;
      else if (
        target.classList.contains('product__plus') &&
        formQtyInput.value < +formQtyInput.max
      )
        formQtyInput.value++;
    });

    // select images container, first img, slider
    const productImages = document.querySelector('.product__images');
    const productImg = document.querySelector('.product__img');
    const productSlider = document.querySelector('.product__slider');

    // // add listener to slider
    productSlider.addEventListener('click', e => {
      e.preventDefault();
      // get btn
      const btn = e.target.closest('.product__slider-btn');
      // if no btn return
      if (!btn) return;
      // get btn direction
      const direction = +btn.dataset.dir;
      // get width if first img
      const imgWidth = productImg.getBoundingClientRect().width;
      // scroll by the img width in the correct direction
      productImages.scrollLeft += imgWidth * direction;
    });

    const allProductImgs = [...document.querySelectorAll('.product__img')];
    const imgObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target === allProductImgs[0])
            document
              .querySelector('.product__slider-btn--left')
              .classList.toggle('hidden', entry.isIntersecting);
          if (entry.target === allProductImgs[allProductImgs.length - 1])
            document
              .querySelector('.product__slider-btn--right')
              .classList.toggle('hidden', entry.isIntersecting);
        });
      },
      { root: productSlider, threshold: 1.0 }
    );

    productImg.addEventListener('load', () => {
      if (!productImg.complete) return;
      observeImgs();
      productImages.style.scrollBehavior = 'auto';
      productImages.scrollLeft = 0;
      productImages.style.scrollBehavior = 'smooth';
    });

    function observeImgs() {
      console.log('observing');
      allProductImgs.forEach((img, i) => {
        if (i === 0 || i === allProductImgs.length - 1)
          imgObserver.observe(img);
      });
    }
  }

  // render spinner
  renderSpinner() {
    productsContainer.innerHTML = `
      <p class="products__loading">Loading...</p>
    `;
  }

  // render error
  renderError(err) {
    productsContainer.innerHTML = `
      <p class="products__error">${err}</p>
    `;
  }
}

export default new productsView();
