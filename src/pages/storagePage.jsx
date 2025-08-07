import { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar.jsx'
import StorageContext from '../contexts/StorageContext.jsx'
import StorageItemsAccordion from '../components/StorageItemsAccordion.jsx'
import StorageDeposit from '../components/StorageDeposit.jsx'
import StorageSelect from '../components/StorageSelect.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { updateStorageType, updateQuantity, deleteItem, getItems } from '../api/groceryList.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import './storage.css'


function Storage() {
  const [items, setItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [loggedInUser, setLoggedInUser] = useState("");
  
  const [currentStorage, setCurrentStorage] = useState("bag");
  const [selectedItems , setSelectedItems] = useState({});

  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])

  // //get item of current login  user 
  // useEffect(() => {
  //   if (loggedInUser !== "") {
  //     getItems(loggedInUser, setItems); // correct order
  //   }
  // }, [loggedInUser, setItems]);

  useEffect(() => {
  if (loggedInUser) {
    getItems(loggedInUser, setItems);
  } else {
    // ✅ Clear out items when logged out
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
      <StorageContext.Provider value={{items, setItems, getItems, currentStorage, setCurrentStorage, selectedItems, setSelectedItems, updateStorageType, updateQuantity, deleteItem}}>
          <Navbar />
          <h1>Storage</h1>
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