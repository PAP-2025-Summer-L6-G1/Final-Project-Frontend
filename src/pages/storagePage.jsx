import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import StorageContext from '../contexts/StorageContext.jsx'
import {getItems} from '../api/storage.jsx'
//import StorageItemsAccordion from '../components/StorageItemsAccordion.jsx'

function Storage(props) {
  const [items, setItems] = useState([]); 
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [isVisible, setIsVisible] = useState(new Set());
  const [currentStorage, setCurrentStorage] = useState("");
  
  // Toggle visibility category, make sure to re-render after change
function toggleVisibility(type) {
  const newSet = new Set(isVisible); // clone
  if (newSet.has(type)) {
    newSet.delete(type);
  } else {
    newSet.add(type);
  }
  setIsVisible(newSet); // New reference will allow react to re-render
}

useEffect(() => {
    getItems(setItems, currentStorage); // Use the getItems to retrieve items for the items state
}, [setItems,currentStorage]);

//We want to split the items by category to make them easier to turn into cards
useEffect(() => {
  //Groups will be our new state
  const groups = {}
  //Go through each item and add it to the correct group
  for (const item of items) {
    if (!groups[item.storageType]) {//If groups doesn't exist in groups, add it
      groups[item.storageType] = []
    }
    groups[item.storageType].push(item)//Don't forget to add item to new groups
  }
  setItemsByCategory(groups)
     // Use the getItems to retrieve items for the items state
}, [items]);

  return (
    <StorageContext.Provider value={{items, getItems, isVisible, currentStorage}}>
        <Navbar />
        <h1>Storage</h1>
        {items.map((item) => (
          <div key={item._id}>{item.name}</div>
        ))}
    </StorageContext.Provider>
  )
}

export default Storage