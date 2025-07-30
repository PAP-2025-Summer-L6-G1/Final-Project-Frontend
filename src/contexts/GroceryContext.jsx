import React from 'react';

const defaultValues = {
  items: [],
  setItems: null,
  getItems: null,
  newItem: null,
  updateQuantity: null,
  updateName: null,
  updateIsBought: null,
  deleteItem: null
};

export default React.createContext(defaultValues);