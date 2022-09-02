'use strict';

const productEle = document.querySelector('.product');
const productWrapEle = document.querySelector('.product-modal');
const closeProductBtn = document.querySelector('.product__close-product');

class productView {
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
        class="product__img product__img--color-1 big"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--color-2"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--color-3"
        />
        <img
        src="${product.image}"
        alt="${product.title}"
        class="product__img product__img--color-4"
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

        <form action="" class="product__form">
          <div class="select-wrap">
            <select name="size" id="size"     class="product__size">
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="X-large">X-Large</option>
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
      productEle
        .querySelector('.product__review--stars')
        .insertAdjacentHTML('beforeend', '<i class="las la-star"></i>');
    }
  }

  // add event listeners to product quantity btns
  addEventQtyBtns() {
    // select elements
    const formQty = productEle.querySelector('.input-wrap');
    const formQtyInput = productEle.querySelector('.product__qty');
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

  // add event listener to add to cart btn
  addEventAddToCart(handler) {
    // select btn ele
    const addToCartBtn = productEle.querySelector('.product__add');
    // add listener
    addToCartBtn.addEventListener('click', e => {
      e.preventDefault();
      // create product properties object
      const specs = {
        size: `${productEle.querySelector('.product__size').value}`,
        color: `${productEle.querySelector('.product__color').value}`,
        qty: +productEle.querySelector('.product__qty').value,
      };
      // run handler
      handler(specs);
    });
  }

  addEventImageGallery() {
    // select img wrappers, slider, imgs
    const productImages = productEle.querySelector('.product__images');
    const productSlider = productEle.querySelector('.product__slider');
    const productImgs = [...productEle.querySelectorAll('.product__img')];

    // 1) MOBILE GALLERY
    //////////////////////////////

    // 1) a) - add functionality to slider btns
    productSlider.addEventListener('click', e => {
      e.preventDefault();
      // get btn
      const btn = e.target.closest('.product__slider-btn');
      // if no btn return
      if (!btn) return;
      // get btn direction
      const direction = +btn.dataset.dir;
      // get width if first img
      const imgWidth = productImgs[0].getBoundingClientRect().width;
      // scroll by the img width in the correct direction
      productImages.scrollLeft += imgWidth * direction;
    });

    // 1) b) - make slider btns hide or appear based on slider position

    //create observer for images
    const imgObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // if the first img is intersecting
          if (entry.target === productImgs[0])
            // hide left arrow
            productEle
              .querySelector('.product__slider-btn--left')
              .classList.toggle('hidden', entry.isIntersecting);
          // if last img is intersecting
          if (entry.target === productImgs[productImgs.length - 1])
            // hide right arrow
            productEle
              .querySelector('.product__slider-btn--right')
              .classList.toggle('hidden', entry.isIntersecting);
        });
      },
      { root: productSlider, threshold: 1.0 }
    );

    // set observer on first and last img
    function observeImgs() {
      productImgs.forEach((img, i) => {
        if (i === 0 || i === productImgs.length - 1) imgObserver.observe(img);
      });
    }

    // when first img loads
    productImgs[0].addEventListener('load', () => {
      if (!productImgs[0].complete) return;
      // set observer
      observeImgs();
      // scroll to the first img without scroll animation
      productImages.style.scrollBehavior = 'auto';
      productImages.scrollLeft = 0;
      productImages.style.scrollBehavior = 'smooth';
    });

    // 2) DESKTOP GALLERY
    // !!!!!!!!!!! ❌ NOT FINISHED ❌ !!!!!!!!!!!!!!!!
    ////////////////////////////////

    productSlider.addEventListener('click', e => {
      e.preventDefault();
      // define clicked img
      const img = e.target.closest('.product__img');
      // only continue if clicked img is one of the small ones
      if (!img || window.innerWidth <= 800 || img.classList.contains('big'))
        return;
      // remove big class
      productImgs.forEach(img => {
        img.classList.remove('big');
      });
      // add big class to clicked img
      img.classList.add('big');
    });
  }

  loadProduct(product, handler) {
    this.renderProductModal(product);
    this.addEventImageGallery();
    this.addEventQtyBtns();
    this.addEventAddToCart(handler);
  }

  addEventCloseProduct() {
    // check if page is index
    if (document.body.id === 'index') return;
    // close product modal
    closeProductBtn.addEventListener('click', e => {
      e.preventDefault();
      productWrapEle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });

    // close product modal with Escape
    document.body.addEventListener('keydown', e => {
      // only continue if Escape is pressed
      if (e.key !== 'Escape') return;
      // close product modal
      productWrapEle.classList.remove('open');
      // return scrolling to body
      document.body.classList.remove('no-scroll');
    });
  }
}

export default new productView();
