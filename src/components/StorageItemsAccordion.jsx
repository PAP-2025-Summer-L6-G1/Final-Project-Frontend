import { useState , useContext} from "react";
import StorageContext from "../contexts/StorageContext";
import "./StorageItemsAccordion.css";
import Trash from "../assets/Trash.svg"

const Accordion = ({ itemsByCategory }) => {
    const [openCategories, setOpenCategories] = useState(new Set());

    const storageContext = useContext(StorageContext);
    const selectedItems = storageContext.selectedItems;
    const setSelectedItems = storageContext.setSelectedItems;

    const increaseQuantity = (item) => {
        storageContext.updateQuantity(item._id, item.quantity + 1, storageContext.items, storageContext.setItems);
    };

    const decreaseQuantity = (item) => {
        if (item.quantity <= 1) {
            const confirmDelete = window.confirm(`"${item.name}" is about to be removed. Do you want to delete it?`);
            if (confirmDelete) {
                storageContext.deleteItem(item._id, storageContext.items, storageContext.setItems);
            }
        } else {
            storageContext.updateQuantity(item._id, item.quantity - 1, storageContext.items, storageContext.setItems);
        }
    };

    const deleteItem = (item) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
        if (confirmDelete) {
            storageContext.deleteItem(item._id, storageContext.items, storageContext.setItems);
        }
    };

    const handleToggle = (category) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };


    const handleCheckboxToggle = (item) => {
        setSelectedItems((prev) => ({
            ...prev,
            [item._id]: !prev[item._id]
        }));
    };


  return (
    <div className="accordion-parent">
        {Object.entries(itemsByCategory)
        .filter(([_, items]) =>
            items.some(item => item.storageType === storageContext.currentStorage)
        ).map(([category, items]) => (
            <div className={`accordion ${openCategories.has(category) ? "toggled" : ""}`} key={category} style={{display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <button type="button" className="toggle" onClick={() => handleToggle(category)}>
                    <span className="toggle-label">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <span className="toggle-icon">{openCategories.has(category) ? "–" : "+"}</span>
                </button>
                {openCategories.has(category) && (
                    <div className="content-parent">
                        {items.map((item, idx) => (
                            <div key={item._id || idx} className="item-row">
                                <div className="item-info">
                                    <div>
                                        <p className="item-name">{item.name}</p>
                                        {item.expiryDate && (
                                            <div className="item-expiry">exp: {item.expiryDate || "N/A"}</div>
                                        )}
                                    </div>
                                    <div className="item-controls">
                                        <div className="quantity-controls">
                                            <button onClick={() => decreaseQuantity(item)}>-</button>
                                            <input type="text" value={item.quantity} readOnly />
                                            <button onClick={() => increaseQuantity(item)}>+</button>
                                        </div>
                                        <button className="delete-button" onClick={() => deleteItem(item)}>
                                            <img className ="delete-icon" src={Trash} alt="Delete" />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="item-checkbox"
                                    checked={!!selectedItems[item._id]}
                                    onChange={() => handleCheckboxToggle(item)}
                                    />
                            </div>
                        ))}
                    </div>
                )}
            </div>
      ))}
    </div>
  );
};

export default Accordion;
