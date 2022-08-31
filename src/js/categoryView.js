'use strict';

const productsContainer = document.querySelector('.products__container');
const productModal = document.querySelector('.product-modal');

class CategoryView {
  renderCategoryProducts(products) {
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
  addEventListenerToCategoryProducts(handler) {
    // guard clause for landing page
    if (!productsContainer) return;
    console.log('--------------------');
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

export default new CategoryView();
