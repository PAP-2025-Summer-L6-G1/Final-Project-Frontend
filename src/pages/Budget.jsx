import Navbar from "../components/Navbar";
import { Chart, ArcElement, Tooltip, DoughnutController } from 'chart.js'
import "./Budget.css"
import { useEffect, useRef } from "react";
import AccountContext from "../contexts/AccountContext";
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useState } from "react";
import { addBudgetItem, deleteBudgetItem, getBudgetItems } from "../api/budget.jsx";

Chart.register(ArcElement, Tooltip, DoughnutController); // These are the elements of the chart that are used. There are others that could be used, but I did not implement them.

function colorGenerator(context) { // match a color with the name of an item's category or with a category's name
    const object = context.raw;
    if (!object) {
        return 0;
    }
    const categoryNames = ["Entertainment", "Food", "Housing", "Transportation", "Utilities"] // For choosing colors
    const colors = ["red", "blue", "green", "orange", "purple"] // Each color corresponds to the category with the same index
    const color = colors[categoryNames.indexOf(object.category)];
    return color;
}

const chartData = {
    datasets: [{
        data: [],
        backgroundColor: colorGenerator
    },
    {
        data: [],
        backgroundColor: colorGenerator
    }]
}
export default function Budget() {
    const [loggedInUser, setLoggedInUser] = useState(""); // login code
    useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
    }, [])

    const chartCanvas = useRef(null) //maybe add reduced motion options?
    const tableBodyRef = useRef(null)

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
        let result = await addBudgetItem(data); // Add the item to mongoDB
        if (result) { // if the item was successfully added, add it to the chart data
            addItemsToChartData([data]);
        }
    }

    function addItemsToChartData(items, clearData = false) {
        if (clearData == true) { // clear out the datasets. I don't think this is ever actually useful, because clearData is only true in
            chartData.datasets[1].data = [] // getItemsAndAddToData, which is only called on the first load of the page,
            chartData.datasets[0].data = [] // but it might be in the future

        }
        let categories = [];
        chartData.datasets[1].data = [...chartData.datasets[1].data, ...items] // append items to the data
        for (let item of items) {
            let indexOfCategory = categories.findIndex((element) => element.category == item.category)
            if (indexOfCategory == -1) { // if the category is not already in chart, create it and set the category's value to the item price
                categories.push({ category: item.category, price: item.price });
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
                chartData.datasets[0].data[indexOfCategory].price += category.price
            }
        }
        chartData.datasets[1].data.sort((a, b) => a.category.localeCompare(b.category))
        chartData.datasets[0].data.sort((a, b) => a.category.localeCompare(b.category))
        update()
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
        // Make the chart
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
                                    const object = context[0].raw;
                                    if (!object) {
                                        return "";
                                    }
                                    if (context[0].datasetIndex == 0) { // If the object is a category, return the category name
                                        return object.category;
                                    }
                                    else if (context[0].datasetIndex == 1) { // If the object is an item, return the item name
                                        return object.name;
                                    }
                                    else {
                                        return "";
                                    }
                                },
                                label: (context) => {
                                    return `\$${context.parsed}`; // return the parsed value (price) with a $ in front of it
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
    function makeTable() {
        const tableBody = tableBodyRef.current
        if (tableBody) {
            tableBody.innerHTML = ""
            chartData.datasets[1].data.map(item => {
                tableBody.innerHTML += `
                    <tr>
                        <th>${item.name}</th>
                        <td>${item.price}</td>
                        <td>${item.category}</td>
                    </tr>`
            })
        }
    }
    function update() {
        const currentChart = Chart.getChart(chartCanvas.current)?.update()
        makeTable()
    }

    return (<>
        <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
            <Navbar />
        </AccountContext.Provider>
        <main>
            <div className="gridContainer">
                <div className="pieContainer">
                    <canvas className="chart"
                        ref={chartCanvas}
                        onClick={async (event) => {
                            //https://masteringjs.io/tutorials/chartjs/onclick-bar-chart
                            const clickedObjects = Chart.getChart(event.target).getElementsAtEventForMode(event, "nearest", { intersect: true }, true);
                            let categories = [];
                            let numDeleted = 0;
                            for (let object of clickedObjects) {
                                if (object.datasetIndex == 1) {
                                    const actualIndex = object.index - numDeleted;
                                    const item = chartData.datasets[object.datasetIndex].data[actualIndex];
                                    const result = await deleteBudgetItem(item._id)
                                    if (result) { // if the item was successfully deleted, add it to an object in the categories array that is the category name and the price of all the object in that category that were removed
                                        const indexOfCategory = categories.findIndex((element) => element.category == item.category)

                                        if (indexOfCategory == -1) { // make a list of the amount of money getting removed from the each category 
                                            categories.push({ category: item.category, price: item.price });
                                        }
                                        else {
                                            categories[indexOfCategory].price += item.price;
                                        }

                                        chartData.datasets[object.datasetIndex].data.splice(actualIndex, 1); // remove the item from the data
                                        numDeleted++;
                                    }
                                }
                            }
                            for (let category of categories) {
                                const indexOfCategory = chartData.datasets[0].data.findIndex((element) => element.category == category.category); // index of category in data
                                if (indexOfCategory != -1) { // if the category is in the data, 
                                    chartData.datasets[0].data[indexOfCategory].price -= category.price // subtract the price of the deleted items from it
                                }
                            }
                            update()
                        }}
                    >
                        The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                    </canvas>
                    {chartData.datasets[1].length > 0 ? <p>Click on an item in the chart to delete it.</p>: <h2>You do not have any budget items yet. Please add one.</h2>}
                </div>
                <form onSubmit={handleFormSubmit} id="budgetForm">
                    <label htmlFor="name">Item name:</label>
                    <input type="text" id="name" />
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" step=".01" min="0.01" inputMode="decimal" />
                    <label htmlFor="category">Category</label>
                    <select id="category" required>
                        {/* To add another category, add an option here, ideally in alphabetical order, and then add it to categoryNames in colorGenerator and a correctponding color to colors in colorGenerator  */}
                        <option value="Entertainment">Entertainment</option>
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
                <table>
                    <caption>Items</caption>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Category</th>
                        </tr>
                    </thead>
                    <tbody ref={tableBodyRef}></tbody>
                </table>
            </div>
        </main>
    </>)
}