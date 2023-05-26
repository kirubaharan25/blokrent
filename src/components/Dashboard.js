import { Component } from "react";
import DashboardBody from "./DashboardBody";
import './Dashboard.css';


export default class Dashboard extends Component{
    render() {
        return(
            <div className="Dashboard-Main">
                <DashboardBody/>
            </div>
        )
    }
};