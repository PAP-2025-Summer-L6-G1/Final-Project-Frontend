import { useState , useContext} from "react";
import StorageContext from "../contexts/StorageContext";
import GroceryListForm from "./GroceryListForm"
import "./StorageItemsAccordion.css";
import Trash from "../assets/Trash.svg"

const Accordion = ({ itemsByCategory }) => {
    const [openCategories, setOpenCategories] = useState(new Set());

    const storageContext = useContext(StorageContext);
    const selectedItems = storageContext.selectedItems;
    const setSelectedItems = storageContext.setSelectedItems;

    const increaseQuantity = async (item) => {
        await storageContext.updateQuantity(item._id, item.quantity + 1, storageContext.items, storageContext.setItems);
    };

    const decreaseQuantity = async (item) => {
        if (item.quantity <= 1) {
            const confirmDelete = window.confirm(`"${item.name}" is about to be removed. Do you want to delete it?`);
            if (confirmDelete) {
                await storageContext.deleteItem(item._id, storageContext.items, storageContext.setItems);
            }
        } else {
            await storageContext.updateQuantity(item._id, item.quantity - 1, storageContext.items, storageContext.setItems);
        }
    };

    const deleteItem = async (item) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
        if (confirmDelete) {
            await storageContext.deleteItem(item._id, storageContext.items, storageContext.setItems);
        }
    };

    const handleClear = async () => {
        //We need some way to get our selectedLength, but it's a set T-T
        // We have to gather all the ids that are actually selected (value === true)
        const selectedIds = Object.entries(selectedItems)
            .filter(([_, isSelected]) => Boolean(isSelected))
            .map(([id]) => id);

        if (selectedIds.length === 0) return; // nothing to do

        //Finally we can see our newly mapped array's length
        const ok = window.confirm(
            `Are you sure you want to delete ${selectedIds.length} selected item${selectedIds.length === 1 ? "" : "s"}?`
        );
        if (!ok) return;

        // Delete each selected item (the delete Item is async)
        for (const id of selectedIds) {
            await storageContext.deleteItem(id, storageContext.items, storageContext.setItems);
        }

        // Clear selection
        setSelectedItems({});
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
        <button className="accordion-clear" onClick={() => handleClear()}>
            Clear Selected
        </button>
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
        <button>
            Add Items
        </button>
    </div>
  );
};

export default Accordion;
