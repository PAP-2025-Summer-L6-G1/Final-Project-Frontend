import { useEffect, useContext, useState } from "react";
import "./GroceryList.css"
import GroceryContext from "../contexts/GroceryContext";
import AccountContext from "../contexts/AccountContext";
import { useRef } from "react";

export default function GroceryList() {
    const groceryContext = useContext(GroceryContext);
    const accountContext = useContext(AccountContext);

    const items = groceryContext.items;
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState("");
    const [isBought, setIsBought] = useState(false);

    async function handleAddItem(event) {
        event.preventDefault();
        const success = await groceryContext.newItem({
            ownerId: accountContext.loggedInUser,
            name: name, 
            quantity: quantity,
            category: category,
            isBought: isBought
        }, items, groceryContext.setItems);

        if (success) {
            setName("");
            setQuantity(1);
            setCategory("");
            setIsBought(false);
        } 
    }
    return (
        <div className="grocery-list">
            <h2> Grocery list </h2>
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
                    <option value="other">Other</option>
                </select>
                <button type="submit">Add Item</button>
                <ul>
                    {items.map((item) => (
                        <li key={item._id}>
                            <input
                                type="checkbox"
                                checked={item.isBought}
                                onChange={() => groceryContext.updateIsBought(item._id, !item.isBought, items, groceryContext.setItems)}
                            />
                            Name: {item.name}, 
                            Quantity: {item.quantity}, 
                            Category: {item.category}, 
                            IsBought: {item.isBought ? "yes" : "no"}  
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    )
}