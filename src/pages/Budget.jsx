import Navbar from "../components/Navbar";
import { Chart } from 'chart.js/auto'
import "./Budget.css"
import { useEffect, useRef } from "react";
import AccountContext from "../contexts/AccountContext";
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { useState } from "react";

export default function Budget() {
    const [loggedInUser, setLoggedInUser] = useState("");
      useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
      }, [])
    const canvas = useRef("") //maybe add reduced motion options?
    useEffect(() => {
        Chart.getChart(canvas.current)?.destroy(); //https://www.chartjs.org/docs/latest/charts/doughnut.html
        const chart = new Chart(canvas.current,
            {
                type: 'doughnut',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '$',
                        data: [12, 19, 3, 5, 2, 3],
                    }]
                },
                
            }
        );
        console.log(chart)

    }, []);
    return (<>
        <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
                <Navbar />
        </AccountContext.Provider>
        <main>
            <div className="pieContainer">
                <canvas className="budget-chart"
                    ref={canvas}
                    >
                    The pie chart failed to render. Please check if there is anything preventing canvases from working on your device.
                </canvas>
            </div>
            <form>
                <label htmlFor="name">Item name:</label>
                <input type="text" id="name" />
                <label htmlFor="price"></label>
                <input type="text" id="price" />
                <label htmlFor="category"></label>
                <input type="text" id="category" />
                <button type="submit">Submit</button>
            </form>
        </main>
        <script>

        </script>
    </>)
}