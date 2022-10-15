'use strict';

import GeneralView from './generalView.js';

class MainPageView extends GeneralView {
  parentEle = document.querySelector('.shop');

  addEventImageGallery() {
    if (document.body.id !== 'index') return;
    // select img wrappers, slider, imgs
    const shopSlider = this.parentEle.querySelector('.shop__items');
    const shopItemsImgs = [
      ...this.parentEle.querySelectorAll('.shop__item__img'),
    ];
    const shopBtns = this.parentEle.querySelector('.shop__btns-wrap');
    // ad functionality to mobile gallery
    this.addEventsMobileGallery('shop', shopSlider, shopItemsImgs, shopBtns);
  }

  // reveal animation - observe items on main page
  observeItems() {
    // only perform io main page
    if (document.body.id !== 'index') return;

    const revealItems = function (entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('unrevealed');
        observer.unobserve(entry.target);
      });
    };

    const options = {
      root: null,
      threshold: 0,
      rootMargin: '-20px',
    };

    const itemObserver = new IntersectionObserver(revealItems, options);

    const items = [...document.querySelectorAll('.slide-in')];

    items.forEach(item => {
      item.classList.add('unrevealed');
      itemObserver.observe(item);
    });
  }
}

export default new MainPageView();
