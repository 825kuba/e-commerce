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
}

export default new MainPageView();
