import Navbar from "../components/Navbar";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController, Title } from 'chart.js'
import "./Budget.css"
import { useEffect, useRef } from "react";
import AccountContext from "../contexts/AccountContext";
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useState } from "react";
import { addBudgetItem, getBudgetItems } from "../api/budget.jsx";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController, Title);


let chartData = {
    datasets: [{
        data: [],
        backgroundColor: (context) => {
            const item = context.raw;
            if (!item) {
                return 0;
            }
            const colors = ["red", "blue", "green", "orange", "purple"]
            const categoryNames = ["Entertainment", "Food", "Housing", "Transportation", "Utilities"] // for choosing colors
            const color = colors[categoryNames.indexOf(item.category)];
            return color;
        }
    },
    {
        data: [],
        backgroundColor: (context) => {
            const item = context.raw;
            if (!item) {
                return 0;
            }
            const colors = ["red", "blue", "green", "orange", "purple"]
            const categoryNames = ["Entertainment", "Food", "Housing", "Transportation", "Utilities"] // for choosing colors
            const color = colors[categoryNames.indexOf(item.category)];
            return color;
        }
    }]
}
export default function Budget() {
    const [loggedInUser, setLoggedInUser] = useState(""); // login code
    useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
    }, [])

    const [counter, setCounter] = useState(0); // increase to trigger an update

    const chartCanvas = useRef("") //maybe add reduced motion options?

    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        let data = {
            ownerId: localStorage.getItem("userId"),
            name: form.name.value,
            price: Number(form.price.value),
            date: new Date(),
            category: form.category.value
        }
        let result = await addBudgetItem(data);
        if (result) { // if the item was successfully added, add it to the chart data
            addItemsToChartData([data])
        }
    }
    
    function addItemsToChartData(items, clearData=false) {
        if (clearData == true) {
            chartData.datasets[1].data = []
            chartData.datasets[0].data = []

        }
        let categories = [];
        chartData.datasets[1].data = [...chartData.datasets[1].data, ...items] // append items to the data
        for (let item of items) {
            let indexOfCategory = categories.findIndex((element) => element.category == item.category)
            console.log(indexOfCategory)
            if (indexOfCategory == -1) { // if the category is not already in chart, create it and set the category's value to the item price
                categories.push({category: item.category, price: item.price}); 
            }
            else { // otherwise, add the item's price to the category's value
                categories[indexOfCategory].price += item.price;
            }
        }
        for (let category of categories) {
            let indexOfCategory = chartData.datasets[0].data.findIndex((element) => element.category == category.category); // index of category in data
            if (indexOfCategory == -1) { // if the category does not already exist in the labels, push it 
                chartData.datasets[0].data.push(category) // set chartDatapoints to itemDatapoints with the at the end 
            }
            else {
                chartData.datasets[0].data[indexOfCategory] += category.price
            }
        }
        chartData.datasets[1].data.sort((a, b) => a.category.localeCompare(b.category))
        chartData.datasets[0].data.sort((a, b) => a.category.localeCompare(b.category))
        setCounter(prevCount => prevCount + 1) // only used to make the page update
    }


    async function getItemsAndAddToData() {
        try {// get the budget items from the current user and send them to the addItemsToChartData method
            const items = await getBudgetItems(); // an array of objects            
            addItemsToChartData(items, true);
        }
        catch (error) {
            console.error(error);
        }
    }
    function makeCharts() { //todo: match colors for items that are in a certain category
        Chart.getChart(chartCanvas.current)?.destroy(); // delete the chart from the canvas if there is already one
        // make chart for chart
        const chartChart = new Chart(chartCanvas.current,
            {
                type: 'doughnut',
                data: chartData,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Price by Category"
                        },
                        tooltip: {
                            callbacks: {
                                title: (context) => {
                                    const item = context[0].raw;
                                        if (!item) {
                                            return "";
                                        }
                                        if (context[0].datasetIndex == 0) {
                                            return item.category;
                                        }
                                        if (context[0].datasetIndex == 1) {
                                            return item.name;
                                        }
                                        else {
                                            return "";
                                        }
                                },
                                label: (context) => {
                                    return `\$${context.parsed}`

                                }
                            }
                        }
                    },
                    parsing: {
                        key: "price"
                    }
                }
            }
        );
    }

    useEffect(() => {
        makeCharts()
        async function asyncWrapper() {
            await getItemsAndAddToData()
        }
        asyncWrapper()

    }, []);
    useEffect(() => {
        Chart.getChart(chartCanvas.current).update()
    }, [counter])
    return (<>
        <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
            <Navbar />
        </AccountContext.Provider>
        <main>
            <div className="gridContainer">
                <div className="pieContainer">
                    <canvas className="chart"
                        ref={chartCanvas}
                    >
                        The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                    </canvas>
                </div>
                <form onSubmit={handleFormSubmit} id="budgetForm">
                    <label htmlFor="name">Item name:</label>
                    <input type="text" id="name" />
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" step=".01" min="0" inputMode="decimal"/>
                    <label htmlFor="category">Category</label>
                    <select id="category" required>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </main>
    </>)
}