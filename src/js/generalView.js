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

  addEventsMobileGallery(parentClass, container, imgs, btnContainer) {
    // 1) - add functionality to slider btns
    btnContainer.addEventListener('click', e => {
      e.preventDefault();
      // get btn
      const btn = e.target.closest(`.${parentClass}__btn`);
      // if no btn return
      if (!btn) return;
      // get btn direction
      const direction = +btn.dataset.dir;
      // get width if first img
      const imgWidth = imgs[0].getBoundingClientRect().width;
      // scroll by the img width in the correct direction
      container.scrollLeft += imgWidth * direction;
    });

    // 2) - make slider btns hide or appear based on slider position

    //create observer for images
    const imgObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // guard clause for when there is only 'loading' message and no other elements - for product modal only
          if (
            parentClass === 'product__slider' &&
            !this.parentEle.querySelector(`.${parentClass}`)
          )
            return;
          // if the first img is intersecting
          if (entry.target === imgs[0]) {
            // hide left arrow
            this.parentEle
              .querySelector(`.${parentClass}__btn--left`)
              .classList.toggle('hidden', entry.isIntersecting);
          }
          // if last img is intersecting
          if (entry.target === imgs[imgs.length - 1])
            // hide right arrow
            this.parentEle
              .querySelector(`.${parentClass}__btn--right`)
              .classList.toggle('hidden', entry.isIntersecting);
        });
      },
      { root: container, threshold: 0.8 }
    );

    // when first img loads
    imgs[0].addEventListener('load', () => {
      if (!imgs[0].complete) return;
      // set observer on first and last img
      imgs.forEach((img, i) => {
        if (i === 0 || i === imgs.length - 1) imgObserver.observe(img);
      });
      // scroll to the first img without scroll animation
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = 0;
      container.style.scrollBehavior = 'smooth';
    });
  }
}
