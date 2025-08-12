import { useRef , useContext} from "react";
import "./StorageSelect.css";
import StorageContext from "../contexts/StorageContext";
import Fridge from "../assets/Fridge.svg"
import Freezer from "../assets/Freezer.svg"
import Pantry from "../assets/Pantry.svg"
import GroceryBag from "../assets/GroceryBag.svg"

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


        // This function is meant to add a 3D tilt effect to the card element when the mouse moves over it (trying to make it pretty)
    const handleMouseMove = (e) => {
        const card = e.currentTarget; // This e is the event and the currentTarget will give me the card.
        const rect = card.getBoundingClientRect(); // Need to get the cards current position and dimensions

        // Get the mouse position relative to the card on a plane
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate the center of the card (should just be 50% of the width/height)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate how far the cursor is from the center (as a percentage) to use for tilt
        // Multiply by an intensity factor (adjust later) to exaggerate the tilt effect
        const rotateX = ((y - centerY) / centerY) * 20; // Tilt up/down
        const rotateY = ((x - centerX) / centerX) * -20; // Tilt left/right (negative to mirror movement)

        // Apply 3D transform to card, including a slight scale-up for emphasis
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    };

    // This function resets the card's transform after the mouse leaves
    const handleMouseLeave = (e) => {
        const card = e.currentTarget; //Grabbing the card again

        // Reseting the transform to default (no rotation, normal scale of 1)
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";

        // Add a transition so it resets smoothly and doesn't jerk back to the init state
        card.style.transition = "transform 0.2s ease";
    };

    //If anyone is reading this, you actually have no idea how long this took and how little the pay off was. I hate CSS T-T



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
                    onMouseMove={(e) => handleMouseMove(e)}//Send the current event to the handlers
                    onMouseLeave={(e) => handleMouseLeave(e)}
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