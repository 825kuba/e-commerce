'use strict';

export default class GeneralView {
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

  observeImgs(imgClass) {
    const loadImg = function (entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', () => {
          entry.target.classList.remove('lazy');
          observer.unobserve(entry.target);
        });
      });
    };

    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0,
      rootMargin: '100px',
    });

    const productImgs = [...document.querySelectorAll(imgClass)];
    productImgs.forEach(img => {
      img.classList.add('lazy');
      imgObserver.observe(img);
    });
  }
}
