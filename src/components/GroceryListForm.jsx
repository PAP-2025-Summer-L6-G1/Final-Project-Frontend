import { useEffect, useContext, useState } from "react";
import GroceryContext from "../contexts/GroceryContext";
import AccountContext from "../contexts/AccountContext";
import "./GroceryListForm.css";
import RestockList from "./RestockList"

export default function GroceryList(props) {
    const groceryContext = useContext(GroceryContext);
    const accountContext = useContext(AccountContext);

    const allCategories = props.cat;
    
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(allCategories[0].toLowerCase());
    const [isBought, setIsBought] = useState(false);

    async function handleAddItem(event) {
        event.preventDefault();

        const success = await groceryContext.newItem({
            ownerId: localStorage.getItem("userId"),
            name: name, 
            quantity: quantity,
            category: category,
            isBought: isBought,
            storageType: "list"
        }, groceryContext.items, groceryContext.setItems);

        if (success) {
            setName("");
            setQuantity(1);
            setCategory(allCategories[0].toLowerCase());
            setIsBought(false);
        } 

        await groceryContext.getItems(localStorage.getItem("userId"), groceryContext.setItems);
    }
    
    // combines all the item qty with same name from all storagetype
    const lowStockItemsMap = new Map();

    groceryContext.items.forEach((item) => {
        const name = item.name.toLowerCase();
        if (!lowStockItemsMap.has(name)) {
            lowStockItemsMap.set(name, { name: item.name, quantity: 0, category: item.category });
        }

        lowStockItemsMap.get(name).quantity += item.quantity;
    });

    const lowStockItems = Array.from(lowStockItemsMap.values()).filter((item) => item.quantity <= 2);

    return (
        <>
            <form id="add-item-form" onSubmit={handleAddItem}>
                <label id="owner-label">Owner: {accountContext.loggedInUser === "" ? "Guest" : accountContext.loggedInUser}</label>

                <div className="form-row">
                    <label htmlFor="item-name">Item Name:</label>
                    <input
                        type="text"
                        id="item-name"
                        value={name}
                        onChange={(event)=> setName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1).toLowerCase())}
                        required />
                </div>
                <div className="form-row">
                <label htmlFor="item-quantity">Quantity:</label>
                <input
                    type="number"
                    step="1"
                    min="1"
                    id="item-quantity"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    required />
                </div>
                <div className="form-row">
                <label htmlFor="item-category">Category:</label>
                <select
                    id="item-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required>

                    {allCategories.map((cat) => (
                        <option key={cat} value={cat.toLowerCase()}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                </div>
                <button type="submit">Add Item</button>
            </form>
            <div className="recommended-restock">
                <h3> Recommended Restock </h3>
                <RestockList lowStockItems={lowStockItems} />
            </div>
        </>
    )
}