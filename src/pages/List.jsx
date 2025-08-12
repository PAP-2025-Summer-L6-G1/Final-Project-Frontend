import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import GroceryList from '../components/GroceryList.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import GroceryContext from '../contexts/GroceryContext.jsx'
import {newItem, getItems, updateQuantity, updateName, updateIsBought, updateStorageType, deleteItem} from '../api/groceryList.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData} from '../api/signIn.jsx'
import { useEffect } from 'react'
//import signin from './api/signIn.jsx'

function List() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])

  //get item of current login  user 
  useEffect(() => {
    if (loggedInUser !== "") {
        getItems(localStorage.getItem("userId"), setItems);
    } else {
        setItems([])
    }
  }, [loggedInUser])

  return (
    <>
        <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
            <GroceryContext.Provider value={{items, setItems, getItems, newItem, updateQuantity, updateName, updateIsBought, updateStorageType, deleteItem}}>
                <Navbar />
                <GroceryList />
            </GroceryContext.Provider>
        </AccountContext.Provider>
    </>
  )
}

export default List
