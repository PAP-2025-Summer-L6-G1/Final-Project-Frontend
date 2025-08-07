import { useState , useContext} from "react";
import "./StorageDeposit.css";
import StorageContext from "../contexts/StorageContext";
import Fridge from "../assets/Fridge.svg"
import Freezer from "../assets/Freezer.svg"
import Pantry from "../assets/Pantry.svg"
import GroceryBag from "../assets/GroceryBag.svg"

const StorageDeposit = () => {
    const storageContext = useContext(StorageContext);
    const selectedItems = storageContext.selectedItems;
    const setSelectedItems = storageContext.setSelectedItems;

    const handleDeposit = (name) => {
        const selected = storageContext.items.filter(item => selectedItems[item._id]);

        for (const item of selected) {
            console.log(item.name, name)
            storageContext.updateStorageType(item._id, name, storageContext.items, storageContext.setItems);
        }

        setSelectedItems({}); // Clear selectedItems object
    };

    const DepositCard = (name, src, message) => {
        return (
            <div className="card">
                <img src={src} alt={name} />
                <div className="card-text">
                    <h3>{name}</h3>
                    <p>{message}</p>
                    <button onClick={() => {handleDeposit(name.toLowerCase())}}>Add Selected</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {storageContext.currentStorage === "fridge" ? null : DepositCard("Fridge", Fridge, "The refrigerator keeps food cold (typically between 32°F and 40°F or 0°C and 4°C).")}
            {storageContext.currentStorage === "pantry" ? null : DepositCard("Pantry", Pantry, "A pantry's primary purpose is to provide storage for food and kitchen supplies at room temperature.")}
            {storageContext.currentStorage === "freezer" ? null : DepositCard("Freezer", Freezer, "The freezer is designed for long-term storage, maintaining temperatures at or below 0°F (-18°C).")}
            {storageContext.currentStorage === "bag" ? null : DepositCard("Grocery Bag", GroceryBag, "A steward of resources that sustain daily life, a grocery bag is a place to stage ingredient for preparation.")}
        </div>
    )

}

export default StorageDeposit;