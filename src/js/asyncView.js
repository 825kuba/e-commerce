'use strict';

export default class AsyncView {
  // render spinner
  renderSpinner() {
    this.parentEle.innerHTML = `
          <p class="products__loading">Loading...</p>
        `;
  }

  // render error
  renderError(err) {
    this.parentEle.innerHTML = `
          <p class="products__error">${err}</p>
        `;
  }
}
