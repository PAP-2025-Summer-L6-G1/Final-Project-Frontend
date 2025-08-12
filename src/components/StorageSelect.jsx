import { useRef , useContext} from "react";
import "./StorageSelect.css";
import StorageContext from "../contexts/StorageContext";
import { handleMouseLeave, handleMouseMove } from "../utils/tilt-hover";

const StorageSelect = () => {
    const storageContext = useContext(StorageContext);
    const currentStorage = storageContext.currentStorage;
    const setCurrentStorage = storageContext.setCurrentStorage;
    const setSelectedItems = storageContext.setSelectedItems;
    const cardRefs = useRef({});

    const storages = storageContext.storages


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