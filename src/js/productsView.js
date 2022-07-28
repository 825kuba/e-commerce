'use strict';

const productsContainer = document.querySelector('.products__container');

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
          <a href="#" class="products__product">
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
          </a>
        `
      );
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

export default new productsView();
