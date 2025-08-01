import { useEffect, useContext, useState } from "react";
import GroceryContext from "../contexts/GroceryContext";
import AccountContext from "../contexts/AccountContext";
import "./GroceryListForm.css";

export default function GroceryList() {
    const groceryContext = useContext(GroceryContext);
    const accountContext = useContext(AccountContext);
    
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState("dairy");
    const [isBought, setIsBought] = useState(false);

    async function handleAddItem(event) {
        event.preventDefault();
        const success = await groceryContext.newItem({
            ownerId: accountContext.loggedInUser,
            name: name, 
            quantity: quantity,
            category: category,
            isBought: isBought,
            storageType: "list"
        }, groceryContext.items, groceryContext.setItems);

        if (success) {
            setName("");
            setQuantity(1);
            setCategory("");
            setIsBought(false);
        } 

        await groceryContext.getItems(accountContext.loggedInUser, groceryContext.setItems);
    }
    
    return (
        <form id="add-item-form" onSubmit={handleAddItem}>
            <label>Owner: {accountContext.loggedInUser}</label>

            <label htmlFor="item-name">Item Name:</label>
            <input
                type="text"
                id="item-name"
                value={name}
                onChange={(event)=> setName(event.target.value)}
                required />
            <label htmlFor="item-quantity">Quantity:</label>
            <input
                type="number"
                id="item-quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required />
            <label htmlFor="item-category">Category:</label>
            <select
                id="item-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required>

                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="fruit">Fruit</option>
                <option value="grain">Grain</option>
            </select>
            <button type="submit">Add Item</button>
        </form>
    )
}