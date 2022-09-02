'use strict';

export const state = {
  categories: {
    ["men's clothing"]: [],
    ["women's clothing"]: [],
    electronics: [],
    jewelery: [],
  },
  session: {
    productModal: {},
    cart: [],
  },
};

export const getProducts = async category => {
  try {
    // fetch data
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    // throw error if needed
    if (!response.ok)
      throw new Error(`There was and error (${response.status}) :(`);
    // tranform data
    const data = await response.json();
    // set isOnSale property - true to first 2 objects
    data.forEach((item, i) => {
      if (i < 2) item.isOnSale = true;
      else item.isOnSale = false;
    });
    // put data in state object
    state.categories[`${category}`] = data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const saveToStorage = () => {
  window.localStorage.setItem('session', JSON.stringify(state.session));
};

export const loadFromStorage = () => {
  const storage = JSON.parse(window.localStorage.getItem('session'));
  state.session = storage ? storage : state.session;
};
