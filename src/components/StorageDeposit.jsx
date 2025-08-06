import { useState , useContext} from "react";
import "./StorageDeposit.css";
import StorageContext from "../contexts/StorageContext";
import Fridge from "../assets/Fridge.svg"
import Freezer from "../assets/Freezer.svg"
import Pantry from "../assets/Pantry.svg"
import GroceryBag from "../assets/GroceryBag.svg"

const StorageDeposit = () => {
    const storageContext = useContext(StorageContext);
    const [selectedItems, setSelectedItems] = useState(storageContext.selectedItems);

    // handleDeposit = () => {
    //     for (const item of selectedItems) {
    //         storageContext.updateItem
    //     }
    // }

    const DepositCard = (name, src, message) => {
        return (
            <div className="card">
                <img src={src} alt={name} />
                <div className="card-text">
                    <h3>{name}</h3>
                    <p>{message}</p>
                    <button onClick={() => console.log(name)}>Add Selected</button>
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