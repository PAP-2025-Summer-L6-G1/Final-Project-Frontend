import { useEffect, useContext, useState } from "react";
import GroceryContext from "../contexts/GroceryContext";
import AccountContext from "../contexts/AccountContext";
import "./GroceryListForm.css";
import RestockList from "./RestockList"

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
            setCategory("dairy");
            setIsBought(false);
        } 

        await groceryContext.getItems(accountContext.loggedInUser, groceryContext.setItems);
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
                        onChange={(event)=> setName(event.target.value)}
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

                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="fruit">Fruit</option>
                    <option value="grain">Grain</option>
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