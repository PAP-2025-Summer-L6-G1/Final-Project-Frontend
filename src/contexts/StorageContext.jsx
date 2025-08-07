import React from 'react';

const defaultValues = {
  //Invisible must be a set of strings that are contained in "Dairy","Meat","Grains","Produce","Misc." this set is empty, but could contain one of the categories in the future.
  items: [],
  setItems: null,
  getItems: null,
  currentStorage: "",
  setCurrentStorage: null,
  selectedItems: null,
  setSelectedItems: null,
  updateStorageType: null,
  updateQuantity: null,
  deleteItem: null
};

export default React.createContext(defaultValues);