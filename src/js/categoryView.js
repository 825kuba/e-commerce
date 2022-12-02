'use strict';

import GeneralView from './generalView.js';

const productsContainer = document.querySelector('.products__container');
const productModal = document.querySelector('.product-modal');
const productModalCloseBtn = document.querySelector('.product__close-product');

class CategoryView extends GeneralView {
  parentEle = document.querySelector('.products__container');

  renderCategoryProducts(products) {
    // clear parent element
    productsContainer.innerHTML = '';
    // loop through products and render them
    // first 2 products loaded as "on sale"
    products.forEach((product, i) => {
      productsContainer.insertAdjacentHTML(
        'beforeend',
        `
          <div class="products__product" id="${
            product.id
          }" role="button" tabindex="0" aria-label="${product.title}">
            ${i > 1 ? '' : '<span class="products__badge">on sale</span>'}
            <img
              src="../img/placeholder.jpg"
              data-src="${product.image}"
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
  addEventListenerToCategoryProducts(handler) {
    // guard clause for landing page
    if (!productsContainer) return;
    // on click
    productsContainer.addEventListener('click', e => {
      // get the product element
      const target = e.target.closest('.products__product');
      // if no target return
      if (!target) return;
      // open product
      this.openProduct(handler, target);
    });

    // on press enter
    this.parentEle.addEventListener('keypress', e => {
      const focused = document.activeElement;
      if (e.key === 'Enter' && focused.classList.contains('products__product'))
        // open product
        this.openProduct(handler, focused);
    });
  }

  openProduct(handler, ele) {
    // open product
    productModal.classList.add('open');
    // focus close btn - that way if user TABs through page it goes through the flow of product modal window
    productModalCloseBtn.focus();
    // switch of scroll of body
    document.body.classList.add('no-scroll');
    // run handler
    handler(ele);
  }
}

export default new CategoryView();
