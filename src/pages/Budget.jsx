import Navbar from "../components/Navbar";
import { Chart } from 'chart.js/auto'
import "./Budget.css"
import { useEffect, useRef } from "react";
import AccountContext from "../contexts/AccountContext";
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useState } from "react";
import { addBudgetItem, getBudgetItems } from "../api/budget.jsx";

export default function Budget() {

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        let data = {
            "ownerId": localStorage.getItem("userId"),
            "name": form.name.value,
            "price": form.price.value,
            "date": new Date(),
            "category": form.category.value
        }
        addBudgetItem(data);
    }

    const [loggedInUser, setLoggedInUser] = useState(""); // login code
    useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
    }, [])


    const categoriesCanvas = useRef("") //maybe add reduced motion options?
    const itemsCanvas = useRef("")
    useEffect(() => {
        async function makeCharts() { //todo: match colors for items that are in a certain category
            const items = await getBudgetItems();
            let categoriesData = {
                labels: [],
                datasets: [{
                    label: "$",
                    data: [],

                }]
            }
            let itemsData = {
                labels: [],
                datasets: [{
                    label: "$",
                    data: [],

                }]
            }
            let categories = {};
            for (let item of items) {
                itemsData.labels.push(item.name)
                itemsData.datasets[0].data.push(item.price)
                if (!categories[item.category]) {
                    categories[item.category] = item.price;
                }
                else {
                    categories[item.category] += item.price;
                }
            }
            for (let category of Object.entries(categories)) {
                categoriesData.labels.push(category[0])
                categoriesData.datasets[0].data.push(category[1])
            }

            Chart.getChart(categoriesCanvas.current)?.destroy(); // make chart for categories
            const categoriesChart = new Chart(categoriesCanvas.current,
                {
                    type: 'doughnut',
                    data: categoriesData,
                }
            );
            Chart.getChart(itemsCanvas.current)?.destroy(); //make chart for items
            const itemsChart = new Chart(itemsCanvas.current,
                {
                    type: 'doughnut',
                    data: itemsData,
                }
            );

        }
        makeCharts();
    }, []);
    return (<>
        <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
            <Navbar />
        </AccountContext.Provider>
        <main>
            <div className="gridContainer">
                <div className="pieContainer cell1">
                    <h2>Price by Category</h2>
                    <canvas className="categories-chart"
                        ref={categoriesCanvas}
                    >
                        The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                    </canvas>
                </div>
                <div className="pieContainer cell2">
                    <h2>Price by Item</h2>
                    <canvas className="items-chart"
                        ref={itemsCanvas}
                    >
                        The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                    </canvas>
                </div>
                <form onSubmit={handleFormSubmit} id="budgetForm">
                    <label htmlFor="name">Item name:</label>
                    <input type="text" id="name" />
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" />
                    <label htmlFor="category">Category</label>
                    <select id="category">
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Transportation">Transportation</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </main>
        <script>

        </script>
    </>)
}