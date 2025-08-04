import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import StorageContext from '../contexts/StorageContext.jsx'
import {getItems} from '../api/storage.jsx'
import StorageItemsAccordion from '../components/StorageItemsAccordion.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import AccountContext from '../contexts/AccountContext.jsx'

function Storage(props) {
  const [items, setItems] = useState([]); 
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [loggedInUser, setLoggedInUser] = useState("");
  const [currentStorage, setCurrentStorage] = useState("bag");
 

  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])

  //get item of current login  user 
  useEffect(() => {
    if (loggedInUser !== "") {
        getItems(loggedInUser, setItems);
    } else {
        setItems([])
    }
  }, [loggedInUser])

useEffect(() => {
    getItems(setItems, currentStorage); // Use the getItems to retrieve items for the items state
}, [setItems,currentStorage]);

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
}, [items]);

  return (
    <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
      <StorageContext.Provider value={{items, getItems, currentStorage}}>
          <Navbar />
          <h1>Storage</h1>
          <StorageItemsAccordion itemsByCategory={itemsByCategory}/>
      </StorageContext.Provider>
    </AccountContext.Provider>
  )
}

export default Storage