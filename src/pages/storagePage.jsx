import { useState, useEffect, useContext } from 'react'

//Contexts
import AccountContext from '../contexts/AccountContext.jsx'
import StorageContext from '../contexts/StorageContext.jsx'

//Components
import Navbar from '../components/Navbar.jsx'
import StorageItemsAccordion from '../components/StorageItemsAccordion.jsx'
import StorageDeposit from '../components/StorageDeposit.jsx'
import StorageSelect from '../components/StorageSelect.jsx'

//Apis
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { updateStorageType, updateQuantity, deleteItem, getItems } from '../api/groceryList.jsx'

//Images
import Fridge from "../assets/Fridge.svg"
import Freezer from "../assets/Freezer.svg"
import Pantry from "../assets/Pantry.svg"
import GroceryBag from "../assets/veggie-bag.png"

//CSS
import './storage.css'


function Storage() {
  const [items, setItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [loggedInUser, setLoggedInUser] = useState("");
  
  const [currentStorage, setCurrentStorage] = useState("bag");
  const [selectedItems , setSelectedItems] = useState({});

  const storages = [
    {
      key: "fridge",
      name: "Fridge",
      src: Fridge,
      message: "The refrigerator keeps food cold (typically between 32°F and 40°F or 0°C and 4°C)."
    },
    {
      key: "freezer",
      name: "Freezer",
      src: Freezer,
      message: "The freezer is designed for long-term storage, maintaining temperatures at or below 0°F (-18°C)."
    },
    {
      key: "pantry",
      name: "Pantry",
      src: Pantry,
      message: "A pantry's primary purpose is to provide storage for food and kitchen supplies at room temperature."
    },
    {
      key: "bag", // match default state and context
      name: "Grocery Bag",
      src: GroceryBag,
      message: "Items recently bought from the store typically arrive in grocery bags. These items have not been distributed yet."
    }
  ];

  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])

  useEffect(() => {
  if (loggedInUser) {
    getItems(loggedInUser, setItems);
  } else {
    setItems([]);
    setItemsByCategory({});
    setSelectedItems({});
  }
}, [loggedInUser]);

  //We want to split the items by category to make them easier to turn into cards
  useEffect(() => {
    //Groups will be our new state
    const groups = {}
    //Go through each item and add it to the correct group
    for (const item of items) {

      // Only include items with matching storageType
      console.log(item.storageType, currentStorage)
      if (item.storageType !== currentStorage) continue;

      if (!groups[item.category]) {//If groups doesn't exist in groups, add it
        groups[item.category] = []
      }
      groups[item.category].push(item)//Don't forget to add item to new groups
    }
    setItemsByCategory(groups)
      // Use the getItems to retrieve items for the items state
  }, [items, currentStorage]);

  return (
    <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
      <StorageContext.Provider value={{items, setItems, getItems, currentStorage, setCurrentStorage, selectedItems, setSelectedItems, updateStorageType, updateQuantity, deleteItem, storages}}>
          <Navbar />
          <div className="storage-select">
            <StorageSelect />
          </div>
          <div className="storage-interact">
            <div className = "storage-left">
              <StorageItemsAccordion itemsByCategory={itemsByCategory}/>
            </div>
            <div className = "storage-right">
              <StorageDeposit />
            </div>
          </div>
      </StorageContext.Provider>
    </AccountContext.Provider>
  )
}

export default Storage