const hostURL = (process.env.NODE_ENV === "production") ? "https://cfa-summer2025-grocerybuddy-api.onrender.com" : "https://localhost:3002";

const apiAddItem = hostURL+ "/grocery";
const apiGetAll = hostURL+ "/grocery/";
const apiUpdateItem = hostURL+ "/grocery/";
const apiDeleteItem = hostURL+ "/grocery/";

//These will help us define our Params for our CRUD operations.

const postNewParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  credentials: 'include'
};
const getAllParams = {
  method: 'GET',
  credentials: 'include'
}
const updateOneParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'PATCH',
  credentials: 'include'
};
const deleteOneParams = {
  method: 'DELETE',
  credentials: 'include'
};

// export async function newItem(item, items, setItems){ // [items, setItems] = useState()...
//   try {

//       const postNewParamsWithBody = {
//       ...postNewParams,
//       body: JSON.stringify(item)
//     };
//     const prev = items;
//     //Begin Fetch
//     fetch(apiAddItem, postNewParamsWithBody).then(response => {
//       //If add fails...
//       if(!response.ok){
//         //Reset items to previous
//         items = prev;
//         throw new Error("Add Item Failed!")
//       }
      
//       return response.json()
//     }).then(() => {
//       //If add succeeds, add the item
//       setItems([item, ...items]);
//     });

//     //Show the item (we don't know if add failed or not yet, show the user what they want)
//     setItems([item, ...items]);
//   } catch(e) {
//       console.error(e);
//   }

// }

export async function newItem(item, items, setItems){ // [items, setItems] = useState()...
  try {
      const newCapitalizedName = item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase();
      item.name = newCapitalizedName

      const postNewParamsWithBody = {
      ...postNewParams,
      body: JSON.stringify(item)
    };

    const response = await fetch(apiAddItem, postNewParamsWithBody);
    if (!response.ok) {
      throw new Error("Add Item Failed!")
    }

    setItems([item, ...items]);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

// get all items from certain user via the ownerId
export async function getItems(ownerId, setItems){ 
  try{
      const response = await fetch(apiGetAll + ownerId, getAllParams)
      if (response.status === 200) {
      let receivedItems = await response.json();
      setItems(receivedItems);
    }
  } catch (error) {
    console.error(error);
  }
}

//This update function will be used whenever quantity is updated by hand or by the decrement / increment
export async function updateQuantity(itemId, newQuantity, items, setItems){// [items, showItems] = useState()...
  try {
      //If the newQuantity is zero, delete it
      if(newQuantity > 0){
        const response = await fetch(apiUpdateItem + itemId, {
            ...updateOneParams,
            body: JSON.stringify({
                quantity: newQuantity
            })
        });
        if (response.status === 200) {
        const item = items.find(item => item._id === itemId);
        item.quantity = newQuantity;
        setItems([...items]);
      }
      }else {
        //If the newQuantity is zero, delete it
        deleteItem(itemId, items, setItems)
      }
  } catch (error) {
    console.error(error);
  }
}

export async function updateName(itemId, newName, items, setItems){// [items, setItems] = useState()...
    try {
        const newCapitalizedName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();
        
        const response = await fetch(apiUpdateItem + itemId, {
            ...updateOneParams,
            body: JSON.stringify({
                name: newCapitalizedName
            })
        });
        const prev = items;

        fetch(response => {

        })
        if (response.status === 200) {
        const item = items.find(item => item._id === itemId);
        item.name = newCapitalizedName;
        setItems([...items]);
      }
    } catch (error) {
      console.error(error);
    }
}

export async function updateIsBought(itemId, newIsBought,items, setItems){// [items, setItems] = useState()...
    try {
        
        const response = await fetch(apiUpdateItem + itemId, {
            ...updateOneParams,
            body: JSON.stringify({
                isBought: newIsBought
            })
        });
        if (response.status === 200) {
        const item = items.find(item => item._id === itemId);
        item.isBought = newIsBought;
        setItems([...items]);
      }
    } catch (error) {
      console.error(error);
    }
}

export async function updateStorageType(itemId, newStorageType, items, setItems) {
  try {
        
        const response = await fetch(apiUpdateItem + itemId, {
            ...updateOneParams,
            body: JSON.stringify({
                storageType: newStorageType
            })
        });
        if (response.status === 200) {
        const item = items.find(item => item._id === itemId);
        item.storageType = newStorageType;
        setItems([...items]);
      }
    } catch (error) {
      console.error(error);
    }
}

export async function deleteItem(itemId, items, showItems) { // [items, showItems] = useState()...
    try {
      const response = await fetch(apiDeleteItem + itemId, deleteOneParams);
      if (response.status === 200) {
        const itemIndex = items.findIndex(item => item._id === itemId);
        items.splice(itemIndex, 1);
        showItems([...items]);
      }
    } catch (error) {
      console.error(error);
    }
  }

