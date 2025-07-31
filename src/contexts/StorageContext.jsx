import React from 'react';

const defaultValues = {
  //Invisible must be a set of strings that are contained in "Dairy","Meat","Grains","Produce","Misc." this set is empty, but could contain one of the categories in the future.
  items: [],
  getItems: null,
  isVisible: null,
  currentStorage: "",
};

export default React.createContext(defaultValues);