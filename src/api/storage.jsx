const hostURL = (process.env.NODE_ENV === "production") ? "https://cfa-summer2025-grocerybuddy-api.onrender.com" : "https://localhost:3002";

//No adding items in storage
const apiGetAll = hostURL+ "/inventory/";
const apiUpdateItem = hostURL+ "/inventory/";
const apiDeleteItem = hostURL+ "/inventory/";

//These will help us define our Params for our CRUD operations.


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

// Function that reads our items list and displays them depending on if they are visible
// Perhaps we have the Dairy section unopened...
export async function getItems(setItems, type){ 
  try{
      const response = await fetch(apiGetAll, getAllParams)
      if (response.status === 200) {
      let receivedItems = await response.json();
      setItems(receivedItems);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function Items(setItems, type){ 
  try{
      const response = await fetch(apiGetAll, getAllParams)
      if (response.status === 200) {
      let receivedItems = await response.json();
      setItems(receivedItems);
    }
  } catch (error) {
    console.error(error);
  }
}
