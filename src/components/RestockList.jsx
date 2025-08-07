import { useEffect, useContext, useState } from "react";
import "./RestockList.css"
import GroceryContext from "../contexts/GroceryContext";
import AccountContext from "../contexts/AccountContext";


export default function RestockList(props) {
    if (props.lowStockItems.length === 0) {
        return <div className="restock-item">No recommended restock items yet.</div>
    }

    return (
        <div className="restock-list">
            {props.lowStockItems.map((item)=> (
                <RestockRow item={item} />
            ))}
        </div>
    )
}

function RestockRow(props) {
    const groceryContext = useContext(GroceryContext);
    const accountContext = useContext(AccountContext);
    
    const [amount, setAmount] = useState(1);

    async function handleAdd() {
        const existingItem = groceryContext.items.find((item) => (item.storageType === "list" && item.name.toLowerCase() === props.item.name.toLowerCase()))
        const newQty = existingItem ? existingItem.quantity += amount : amount
        await groceryContext.newItem({
            ownerId: accountContext.loggedInUser,
            name: props.item.name,
            quantity: newQty,
            category: props.item.category,
            isBought: false,
            storageType: "list",
        }, groceryContext.items, groceryContext.setItems);

        setAmount(1)
        await groceryContext.getItems(accountContext.loggedInUser, groceryContext.setItems);
    }

    return (
        <div className="restock-item">
            <span>{props.item.name}</span>
            <span>Current: {props.item.quantity}</span>
            <input 
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(event) => {
                    if (/^\d*$/.test(event.target.value)) {
                        setAmount(Number(event.target.value));
                    }
                }}/>
            <button onClick={handleAdd}>Add</button>

        </div>
    )
}