import { useState , useContext} from "react";
import "./StorageDeposit.css";
import StorageContext from "../contexts/StorageContext";


const StorageDeposit = () => {
    const storageContext = useContext(StorageContext);
    const selectedItems = storageContext.selectedItems;
    const setSelectedItems = storageContext.setSelectedItems;
    const storages = storageContext.storages;

    const handleDeposit = (name) => {
        const selected = storageContext.items.filter(item => selectedItems[item._id]);

        for (const item of selected) {
            console.log(item.name, name)
            storageContext.updateStorageType(item._id, name, storageContext.items, storageContext.setItems);
        }

        setSelectedItems({}); // Clear selectedItems object
    };

    const DepositCard = (storage) => {
        return (
            <div className="card">
                <img src={storage.src} alt={storage.name} />
                <div className="card-text">
                    <h3>{storage.name}</h3>
                    <p>{storage.message}</p>
                    <button onClick={() => {handleDeposit(storage.key.toLowerCase())}}>Add Selected</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {storageContext.currentStorage === "fridge" ? null : DepositCard(storages[0])}
            {storageContext.currentStorage === "freezer" ? null : DepositCard(storages[1])}
            {storageContext.currentStorage === "pantry" ? null : DepositCard(storages[2])}
            {storageContext.currentStorage === "bag" ? null : DepositCard(storages[3])}
        </div>
        /*<div>
            {storageContext.currentStorage === "fridge" ? null : DepositCard("Fridge", Fridge, "The refrigerator keeps food cold (typically between 32°F and 40°F or 0°C and 4°C).")}
            {storageContext.currentStorage === "freezer" ? null : DepositCard("Freezer", Freezer, "The freezer is designed for long-term storage, maintaining temperatures at or below 0°F (-18°C).")}
            {storageContext.currentStorage === "pantry" ? null : DepositCard("Pantry", Pantry, "A pantry's primary purpose is to provide storage for food and kitchen supplies at room temperature.")}
            {storageContext.currentStorage === "bag" ? null : DepositCard("Grocery Bag", GroceryBag, "A steward of resources that sustain daily life, a grocery bag is a place to stage ingredient for preparation.")}
        </div>*/
    )

}

export default StorageDeposit;