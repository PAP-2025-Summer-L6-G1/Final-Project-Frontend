const hostURL = "https://localhost:3002/";

const apiURL = hostURL + "budget";


const getParams = {
  method: 'GET',
  credentials: 'include'
};
const postParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  credentials: 'include'
};
const deleteParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'DELETE',
  credentials: 'include'
};


export async function getBudgetItems() {
    const userID = localStorage.getItem("userId");
    const url = apiURL + "/" + userID;
    const response = await fetch(url, getParams);
    if (response.status === 200) {
      const items = await response.json();
      return items;
    }
    else {
      return null;
    }
}
export async function addBudgetItem(item) {
  const postParamsWithBody = {
    ...postParams,
    body: JSON.stringify(item)
  };

  const response = await fetch(apiURL, postParamsWithBody);
  if (response.status === 201) {
    return true;
  }
  else {
    return false;
  }
}
export async function deleteBudgetItem(itemID) {
  const deleteParamsWithBody = {
    ...deleteParams,
    body: JSON.stringify({_id: itemID})
  }
  const response = await fetch(apiURL, deleteParamsWithBody)
  if (response.status == 200) {
    return true;
  }
  else {
    return false;
  }
}