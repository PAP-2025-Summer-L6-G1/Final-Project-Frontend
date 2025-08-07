import { useEffect, useContext, useState } from "react";
import "./GroceryList.css"
import GroceryContext from "../contexts/GroceryContext";
import GroceryListItem from "./GroceryListItem";
import GroceryListForm from "./GroceryListForm";

export default function GroceryList() {
    const groceryContext = useContext(GroceryContext);

    const [filterCategory, setFilterCategory] = useState("");

    async function sendAllBoughtToBag() {
        const checkedItem = groceryContext.items.filter((item) => item.storageType === "list" && item.isBought)

        for (let item of checkedItem) {
            const existingBagItem = groceryContext.items.find((bagItem) => (bagItem.storageType === "bag" && bagItem.name.toLowerCase() === item.name.toLowerCase()));
            if (existingBagItem) {
                const newQuantity = existingBagItem.quantity + item.quantity;
                await groceryContext.updateQuantity(existingBagItem._id, newQuantity, groceryContext.items, groceryContext.setItems); // update quantity in bag
                await groceryContext.deleteItem(item._id, groceryContext.items, groceryContext.setItems); // deletes the list entry
            } else {
                await groceryContext.updateStorageType(item._id, "bag", groceryContext.items, groceryContext.setItems); //just moves list item to bag
            }
        }
    }

    const allCategories = ["dairy", "meat", "grain", "fruit"];

    const filteredItems = groceryContext.items.filter((item) => (
        item.storageType === "list" && (item.category === filterCategory || filterCategory === "")
    ))

    const groupedItems = {};
    filteredItems.forEach((item) => {
        const category = item.category;
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item);
    })
    
    return (
        <div className="grocery-list-page-container">
            <div className="grocery-list">
                <h2> Grocery list </h2>
                <div className="grocery-header">
                    <div className="filter">
                        <label htmlFor="category-filter">Filter by category:</label>
                        <select id="category-filter" value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} >
                            <option value="">All Categories</option>
                            {allCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="send-bag">
                        <button onClick={sendAllBoughtToBag}>Send bought to bag</button>
                    </div>
            
                </div>
                {filteredItems.length === 0 ? (<p>No items in list for selected category.</p>) : null}
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div className="category-group">
                        <h3 className="category-label">{category}</h3>
                        {items.map((item, index) => (
                            <GroceryListItem key={index} item={item} />
                        ))}
                    </div>
                ))}
            </div>

            <div className="grocery-list-form">
                <GroceryListForm />
            </div>
        </div>
    )
}