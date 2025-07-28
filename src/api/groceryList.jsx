const hostURL = (process.env.NODE_ENV === "production") ? "https://cfa-summer2025-vincently-api.onrender.com" : "https://localhost:3002";

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

async function newItem(item, items, setItems){ // [items, setItems] = useState()...
  try {

      const postNewParamsWithBody = {
      ...postNewParams,
      body: JSON.stringify(item)
    };
    const prev = items;
    //Begin Fetch
    fetch(apiAddItem, postNewParamsWithBody).then(response => {
      //If add fails...
      if(!response.ok){
        //Reset items to previous
        items = prev;
        throw new Error("Add Item Failed!")
      }
      
      return response.json()
    }).then(() => {
      //If add succeeds, add the item
      setItems([item, ...items]);
    });

    //Show the item (we don't know if add failed or not yet, show the user what they want)
    setItems([item, ...items]);
  } catch(e) {
      console.error(e);
  }


  //update ui
}

// Just like isSecret, we will have a filter option to show items of a certain type
// Perhaps we have the Dairy section unopened...
async function getItems(isVisible, setItems){ 
  try{
      const response = await fetch(apiGetAll + isVisible, getAllParams)
      if (response.status === 200) {
      let receivedItems = await response.json();
      setItems(receivedItems);
    }
  } catch (error) {
    console.error(error);
  }
}

//This update function will be used whenever quantity is updated by hand or by the decrement / increment
async function updateQuantity(itemId, newQuantity, items, setItems){// [items, showItems] = useState()...
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
        deleteItem(itemId)
      }
  } catch (error) {
    console.error(error);
  }
}

async function updateName(itemId, newName, items, showItems){// [items, showItems] = useState()...
    try {
        
        const response = await fetch(apiUpdateItem + itemId, {
            ...updateOneParams,
            body: JSON.stringify({
                name: newName
            })
        });
        if (response.status === 200) {
        const item = items.find(item => item._id === itemId);
        item.name = newName;
        showItems([...items]);
      }
    } catch (error) {
      console.error(error);
    }
}

//UpdateCheckMark?

async function deleteItem(itemId, items, showItems) { // [items, showItems] = useState()...
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

