import Navbar from "../components/Navbar";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController, Title } from 'chart.js'
import "./Budget.css"
import { useEffect, useRef } from "react";
import AccountContext from "../contexts/AccountContext";
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useState } from "react";
import { addBudgetItem, getBudgetItems } from "../api/budget.jsx";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController, Title);


let categoriesData = {
    labels: [],
    datasets: [{
        label: "$",
        data: [],
        backgroundColor: []
    }]
}
let itemsData = {
    labels: [],
    datasets: [{
        label: "$",
        data: [],
        backgroundColor: []
    }]
}
export default function Budget() {
    const [loggedInUser, setLoggedInUser] = useState(""); // login code
    useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
    }, [])

    const [counter, setCounter] = useState(0); // increase to trigger an update

    const categoriesCanvas = useRef("") //maybe add reduced motion options?
    const itemsCanvas = useRef("")

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
        const colors = ["red", "blue", "green", "orange", "purple"]
        const categoryNames = ["Entertainment", "Food", "Housing", "Transportation", "Utilities"] // for choosing colors

        if (clearData == true) {
            itemsData.datasets[0].data
            categoriesData.datasets[0].data = []
            itemsData.labels = []
            categoriesData.labels = [] // empty out the data and labels

        }
        let categories = {};
        for (let item of items) {
            itemsData.labels.push(item.name)
            itemsData.datasets[0].data.push(item.price) // set itemDatapoints to itemDatapoints with item.price at the end 

            if (!categories[item.category]) { // if the category is not already in categories, create it and set the category's value to the item price
                categories[item.category] = item.price;
            }
            else { // otherwise, add the item's price to the category's value
                categories[item.category] += item.price;
            }


            // set background color depending on category here, because category is accessible from here
            let index = categoryNames.indexOf(item.category)
            if (index != -1) {
                itemsData.datasets[0].backgroundColor.push(colors[index]) // get the color that has the same index as the category of the item
            }
            else {
                itemsData.datasets[0].backgroundColor.push("black") // as a failsafe, color it black.
            }
        }
        for (let category of Object.entries(categories)) {
            let indexOfCategory = categoriesData.labels.indexOf(category[0]);
            if (indexOfCategory == -1) { // if the category does not already exist in the labels, push it 
                categoriesData.labels.push(category[0])
                categoriesData.datasets[0].data.push(category[1]) // set categoriesDatapoints to itemDatapoints with the at the end 
            }
            else {
                categoriesData.datasets[0].data[indexOfCategory] += category[1]
            }
            let index = categoryNames.indexOf(category[0])
            if (index != -1) {
                categoriesData.datasets[0].backgroundColor.push(colors[index]) // get the color that corresponds to the category
            }
            else {
                categoriesData.datasets[0].backgroundColor.push("black") // as a failsafe, color it black.
            }
        }
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
        Chart.getChart(categoriesCanvas.current)?.destroy(); // delete the chart from the canvas if there is already one
        // make chart for categories
        const categoriesChart = new Chart(categoriesCanvas.current,
            {
                type: 'doughnut',
                data: categoriesData,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Price by Category"
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `\$${context.parsed}`

                                }
                            }
                        }
                    }
                }
            }
        );

        Chart.getChart(itemsCanvas.current)?.destroy(); // delete the chart from the canvas if there is already one
        //make chart for items
        const itemsChart = new Chart(itemsCanvas.current,
            {
                type: 'doughnut',
                data: itemsData,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Price by Item"
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `\$${context.parsed}`

                                }
                            }
                        },
                        legend: {
                            display: true
                        }
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
        Chart.getChart(categoriesCanvas.current).update()
        Chart.getChart(itemsCanvas.current).update()
    }, [counter])
    return (<>
        <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
            <Navbar />
        </AccountContext.Provider>
        <main>
            <div className="gridContainer">
                <div className="pieContainer cell1">
                    <canvas className="categories-chart"
                        ref={categoriesCanvas}
                    >
                        The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                    </canvas>
                </div>
                <div className="pieContainer cell2">
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
            <button onClick={() => {
                addItemsToChartData([{
                    ownerId: localStorage.getItem("userId"),
                    name: "Test",
                    price: 10,
                    date: new Date(),
                    category: "Transportation"
                }])
            }}></button>
        </main>
        <script>

        </script>
    </>)
}