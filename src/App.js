import { BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Logo from "./images/BlockRentLogo-NoBackground.png";
import HeaderLogo from "./images/BlokRentText.png";
import './App.css';

export default function App() {
  return (
    <div className="App">
      <center>
        <header className="App-header" >
          <br/>
          <img src={Logo} alt="Logo"/>
          <br/>
          <img src={HeaderLogo} alt="BlokRent Logo"/>
          <br/>
          <b style={{color: "#e23e57"}}>
            - Property Rental System on the Blockchain -
          </b>
        </header>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login/>} />
            <Route path="Register" element={<SignUp/>} />
            <Route path="dashboard" element={<Dashboard/>} />
          </Routes>
        </BrowserRouter>
      </center>
    </div>
  );
};

