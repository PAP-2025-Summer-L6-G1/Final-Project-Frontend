import { useRef , useContext} from "react";
import "./StorageSelect.css";
import StorageContext from "../contexts/StorageContext";
import Fridge from "../assets/Fridge.svg"
import Freezer from "../assets/Freezer.svg"
import Pantry from "../assets/Pantry.svg"
import GroceryBag from "../assets/GroceryBag.svg"
import { handleMouseLeave, handleMouseMove } from "../utils/tilt-hover";

const StorageSelect = () => {
    const storageContext = useContext(StorageContext);
    const currentStorage = storageContext.currentStorage;
    const setCurrentStorage = storageContext.setCurrentStorage;
    const setSelectedItems = storageContext.setSelectedItems;
    const cardRefs = useRef({});

    const storages = [
      {
        key: "fridge",
        name: "Fridge",
        src: Fridge,
        message: "The refrigerator keeps food cold (typically between 32°F and 40°F or 0°C and 4°C)."
      },
      {
        key: "freezer",
        name: "Freezer",
        src: Freezer,
        message: "The freezer is designed for long-term storage, maintaining temperatures at or below 0°F (-18°C)."
      },
      {
        key: "pantry",
        name: "Pantry",
        src: Pantry,
        message: "A pantry's primary purpose is to provide storage for food and kitchen supplies at room temperature."
      },
      {
        key: "bag", // match default state and context
        name: "Grocery Bag",
        src: GroceryBag,
        message: "Items recently bought from the store typically arrive in grocery bags. These items have not been distributed yet."
      }
    ];

    return (
        <div className="select-card-container">
            {storages.map(({ key, name, src, message }) => (
                <div
                    key={key}
                    className={`select-card ${currentStorage === key ? "current" : ""}`}
                    onClick={() => {
                        setCurrentStorage(key);
                        setSelectedItems({});
                         // update key and reset selected
                    }}
                    //Mouse Hover Logic:
                    onMouseMove={handleMouseMove}//Send the current event to the handlers
                    onMouseLeave={handleMouseLeave}
                    ref={el => cardRefs.current[key] = el}
                >
                    <img src={src} alt={name} />
                    <h3>{name}</h3>
                    <p>{message}</p>
                </div>
            ))}
        </div>
    );
};

export default StorageSelect;