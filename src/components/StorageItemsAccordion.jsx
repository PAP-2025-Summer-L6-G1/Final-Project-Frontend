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
        storageContext.updateQuantity(item._id, item.quantity - 1, storageContext.items, storageContext.setItems);
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
        {Object.entries(itemsByCategory).map(([category, items]) => (
            <div className={`accordion ${openCategories.has(category) ? "toggled" : ""}`} key={category}>
                <button className="toggle" onClick={() => handleToggle(category)}>
                    <p>{category}</p>
                    <div className="toggle-icon">{openCategories.has(category) ? "-" : "+"}</div>
                </button>
                {openCategories.has(category) && (
                    <div className="content-parent">
                        {items.map((item, idx) => (
                            <div key={item._id || idx} className="item-row">
                                <div className="item-info">
                                    <input
                                    type="checkbox"
                                    className="item-checkbox"
                                    checked={!!selectedItems[item._id]}
                                    onChange={() => handleCheckboxToggle(item)}
                                    />
                                    <div>
                                        <div className="item-name">{item.name}</div>
                                        {item.expiryDate && (
                                            <div className="item-expiry">exp: {item.expiryDate}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="quantity-controls">
                                    <button onClick={() => decreaseQuantity(item)}>-</button>
                                    <input type="text" value={item.quantity} readOnly />
                                    <button onClick={() => increaseQuantity(item)}>+</button>
                                </div>
                                <button className="delete-button" onClick={() => deleteItem(item)}>
                                    <img className ="delete-icon" src={Trash} alt="Delete" />
                                </button>
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
