import { useEffect, useContext, useState, useRef } from "react";
import GroceryContext from "../contexts/GroceryContext";
import "./GroceryListItem.css";

export default function GroceryListItem(props) {
    const groceryContext = useContext(GroceryContext);
    const item = props.item;

    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const [newQuantity, setNewQuantity] = useState(item.quantity);
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);

    async function handleQuantityChange(amount) {
        groceryContext.updateQuantity(item._id, item.quantity + amount, groceryContext.items, groceryContext.setItems);
    }

    async function handleEdit() {
        setNewName(item.name);
        setNewQuantity(item.quantity);
        setEditing(true);
    }

    async function handleSave() {
        groceryContext.updateName(item._id, newName, groceryContext.items, groceryContext.setItems);
        groceryContext.updateQuantity(item._id, newQuantity, groceryContext.items, groceryContext.setItems);
        setEditing(false);
        setShowMenu(false);
    }

    async function handleDelete() {
        groceryContext.deleteItem(item._id, groceryContext.items, groceryContext.setItems)
        setShowMenu(false);
    }

    async function handleCancel() {
        setEditing(false);
        setShowMenu(false);
    }

    useEffect(() => {
        if (!showMenu) {
            setEditing(false);
        }
    }, [showMenu])

    useEffect(() => {
        function handleClickOut(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setEditing(false);
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOut);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOut);
        }
    }, [showMenu])

    return (
        <div className="grocery-item-container" ref={menuRef}>
            <div className="item-container-left">
                <input
                    type="checkbox"
                    checked={item.isBought}
                    onChange={() => {groceryContext.updateIsBought(item._id, !item.isBought, groceryContext.items, groceryContext.setItems)}}
                />
                {editing ? (<input value={newName} onChange={(event) => setNewName(event.target.value)} />) : (<>{item.name}</>)}
            </div>

            <div className="item-container-right">
                {editing ? (<input value={newQuantity} type="number" onChange={(event) => setNewQuantity(Number(event.target.value))}/>) : (
                    <>
                        <button type="button" className="quantity-button" onClick={() => handleQuantityChange(-1)}>-</button>
                            <span className="item-quantity">{item.quantity}</span>
                        <button type="button" className="quantity-button" onClick={() => handleQuantityChange(1)}>+</button> 
                    </>)}
                
                <div className="menu-container">
                    <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⁝</button>
                    {showMenu ? (
                        <div className="menu-dropdown">
                            {editing ? 
                                (
                                    <>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleEdit}>Edit</button>
                                        <button onClick={handleDelete}>Delete</button>
                                    </>
                                )
                            }
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
                
    )
}