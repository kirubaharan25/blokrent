import Web3 from 'web3';
import React, {useState, useEffect} from 'react';
import MyContract_abi from './MyContract_abi.json';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import './DashboardBody.css';

const DashboardBody = () => {
    const [email, setEmail] = useState('');

    useEffect( ()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
                console.log(email);
            } else {
                console.log("user is logged out")
            }
          });
    }, []);
    console.log(email);

    let contractAddress = '0xC89cf0dec2aC27AdFae85e6Ea5af11ADbD358496';
    
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState('Connect Wallet')
    const [errorMessage, setErrorMessage] = useState(null);

    const [addPropertyButton, setAddPropertyButton] = useState('false');
    const [viewPropertyButton, setViewPropertyButton] = useState('false');
    const [viewLandLordPropertyButton, setViewLandLordPropertyButton] = useState('false');
    const [viewRequestsButton, setViewRequestsButton] = useState('false');
    const [rentedPropertyButton, setRentedPropertyButton] = useState('false');

    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
    const [properties, setProperties] = useState([]);

    const [propertyId, setPropertyId] =useState([]);
    const [propertyOwnerAddress, setPropertyOwnerAddress] = useState([]);
    const [propertyOwnerContact, setPropertyOwnerContact] = useState([]);
    const [propertyLocation, setPropertyLocation] = useState([]);
    const [propertyPrice, setPropertyPrice] = useState([]);
    const [propertyTenantAddress, setPropertyTenantAddress] = useState([]);
    const [propertyTenantContact, setPropertyTenantContact] = useState([]);
    const [propertyOccupied, setPropertyOccupied] = useState([]);

    const [landlordPropertyId, setLandlordPropertyId] = useState([]);
    const [landlordPropertyAddress, setLandlordPropertyAddress] = useState([]);
    const [landlordPropertyContact, setLandlordPropertyContact] = useState([]);
    const [landlordPropertyLocation, setLandlordPropertyLocation] = useState([]);
    const [landlordPropertyPrice, setLandlordPropertyPrice] = useState([]);
    const [landlordPropertyTenant, setLandlordPropertyTenant] = useState([]);
    const [landlordPropertyTenantContact, setLandlordPropertyTenantContact] = useState([]);
    const [landlordPropertyOccupied, setLandlordPropertyOccupied] = useState([]);

    const [requestId, setRequestId] = useState([]);
    const [requestPropertyId, setRequestPropertyId] = useState([]);
    const [requestFrom, setRequestFrom] = useState([]);
    const [requestEmail, setRequestEmail] = useState([]);
    const [requestPropertyLocation, setRequestPropertyLocation] = useState([]);
    const [requestPropertyPrice, setRequestPropertyPrice] = useState([]);

    const resetVariables = () => {
        setProperties(properties=>[]);
        setPropertyId(propertyId=>[]);
        setPropertyOwnerAddress(propertyOwnerAddress=>[]);
        setPropertyOwnerContact(propertyOwnerContact=>[]);
        setPropertyLocation(propertyLocation=>[]);
        setPropertyPrice(propertyPrice=>[]);
        setPropertyTenantAddress(propertyTenantAddress=>[]);
        setPropertyTenantContact(propertyTenantContact=>[]);
        setPropertyOccupied(propertyOccupied=>[]);
        setLandlordPropertyId(landlordPropertyId=>[]);
        setLandlordPropertyAddress(landlordPropertyAddress=>[]);
        setLandlordPropertyContact(landlordPropertyContact=>[])
        setLandlordPropertyLocation(landlordPropertyLocation=>[]);
        setLandlordPropertyPrice(landlordPropertyPrice=>[]);
        setLandlordPropertyTenant(landlordPropertyTenant=>[]);
        setLandlordPropertyTenantContact(landlordPropertyTenantContact=>[]);
        setLandlordPropertyOccupied(landlordPropertyOccupied=>[]);
        setRequestId(requestId=>[]);
        setRequestPropertyId(requestPropertyId=>[]);
        setRequestFrom(requestFrom=>[]);
        setRequestEmail(requestEmail=>[]);
        setRequestPropertyLocation(requestPropertyLocation=>[]);
        setRequestPropertyPrice(requestPropertyPrice=>[]);
    }

    const handleAddPropertyButton = async () => {
        if(addPropertyButton === 'true'){
            setAddPropertyButton('false');
        } else if (addPropertyButton === 'false') {
            setAddPropertyButton('true');
        }
    };

    const handleViewPropertyButton = async() => {
        if(viewPropertyButton === 'true'){
            resetVariables();
            setViewPropertyButton('false');
        } else if (viewPropertyButton === 'false') {
            await getPropertiesOnBlockchain();
            setViewPropertyButton('true');
        }
    };

    const handleViewLandLordPropertyButton = async() => {
        if(viewLandLordPropertyButton === 'true'){
            resetVariables();
            setViewLandLordPropertyButton('false');
        } else if (viewLandLordPropertyButton === 'false') {
            await getLandLordProperties();
            setViewLandLordPropertyButton('true');
        }
    }

    const handleViewRequestsButton = async() => {
        if(viewRequestsButton === 'true'){
            resetVariables();
            setViewRequestsButton('false');
        } else if (viewRequestsButton === 'false') {
            await getPropertyRequests();
            setViewRequestsButton('true');
        }
    }

    const handleRentedPropertyButton = async() => {
        if(rentedPropertyButton === 'true') {
            resetVariables();
            setRentedPropertyButton('false');
        } else if(rentedPropertyButton === 'false'){
            await getRentedProperties();
            setRentedPropertyButton('true');
        }
    }

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }

    const connectWalletHandler = () =>  {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnectButtonText('Wallet Connected');
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension')
        }
    };

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        console.log("Account has been changed to:", newAccount)
    }

    const chainChangedHandler = () => {
		window.location.reload();
	}

    const addPropertyOnBlockchain = async () => {
        if (location !== '' && price !== 0) {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
            await contract.methods.addProperty(email, location, price).send({from:defaultAccount}).then(console.log);
            alert("Property Added");
            setLocation("");
            setPrice(0);

        } else {
            alert("Please fill in all the required details to continue");
        }
    }

    const getPropertiesOnBlockchain = async () => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.getProperties().call()
        .then((res) =>{
            let propertyCount = res[0].length;
            let arr = [];
            for (var i=0; i< propertyCount ; i++) {
                for (var j=0; j<=7 ; j++){
                    if(j===0) {
                        arr[i] = res[j][i];
                    } else {
                        arr[i] += "," + res[j][i];
                    }
                }
            }

            for (var x = 0; x < arr.length ; x++) {
                properties.push(arr[x]);
            }

            for (var y=0; y<properties.length;y++){
                let arr = [];
                arr = properties[y].split(',');
                propertyId.push(arr[0]);
                propertyOwnerAddress.push(arr[1]);
                propertyOwnerContact.push(arr[2]);
                propertyLocation.push(arr[3]);
                propertyPrice.push(arr[4]);
                propertyTenantAddress.push(arr[5]);
                propertyTenantContact.push(arr[6]);
                propertyOccupied.push(arr[7]);
            }
        });
    }

    const getLandLordProperties = async() => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.getLandlordProperties().call({from: defaultAccount})
        .then((res) => {
            let propertyCount = res[0].length;
            let arr = [];
            for (var i=0; i< propertyCount ; i++) {
                for (var j=0; j<=7 ; j++){
                    if(j===0) {
                        arr[i] = res[j][i];
                    } else {
                        arr[i] += "," + res[j][i];
                    }
                }
            }
            
            for (var x=0; x<arr.length; x++){
                let arr2 = arr[x].split(",");
                if(arr2[2] !== ''){
                    landlordPropertyId.push(arr2[0]);
                    landlordPropertyAddress.push(arr2[1]);
                    landlordPropertyContact.push(arr[2])
                    landlordPropertyLocation.push(arr2[3]);
                    landlordPropertyPrice.push(arr2[4]);
                    landlordPropertyTenant.push(arr2[5]);
                    landlordPropertyTenantContact.push(arr2[6]);
                    landlordPropertyOccupied.push(arr2[7]);
                }
            }
        });
    }

    const requestProperty = async(propertyId, addressTo) => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.requestProperty(propertyId, addressTo, email).send({from: defaultAccount}).then(console.log);
        alert("Property Requested")
    }

    const getPropertyRequests = async() => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.getRentRequest().call({from: defaultAccount})
        .then((res) => {
            let requestCount = res[0].length;
            let arr = [];
            for (var i=0; i< requestCount ; i++) {
                for (var j=0; j<=3 ; j++){
                    if(j===0) {
                        arr[i] = res[j][i];
                    } else {
                        arr[i] += "," + res[j][i];
                    }
                }
            }

            for (var x=0; x<arr.length; x++) {
                let arr2 = arr[x].split(',');
                console.log(arr2);
                if (arr2[0] !== '0x0000000000000000000000000000000000000000000000000000000000000000'){
                    requestId.push(arr2[0]);
                    requestPropertyId.push(arr2[1]);
                    requestFrom.push(arr2[2]);
                    requestEmail.push(arr2[3]);
                }
            }
        });

        await getPropertiesOnBlockchain();

        for (var y=0; y<propertyId.length; y++){
            for (var z=0; z<requestPropertyId.length; z++){
                if (propertyId[y] === requestPropertyId[z]){
                    requestPropertyLocation.push(propertyLocation[y]);
                    requestPropertyPrice.push(propertyPrice[y]);
                }
            }
        }
    }

    const acceptRequest = async(requestId, propertyId, pendingTenant) => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.acceptRentRequest(requestId, propertyId, pendingTenant, email).send({from:defaultAccount}).then(console.log);
        alert("Accepted Request")
    }

    const denyRequest = async(requestId) => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.denyRentRequest(requestId).send({from: defaultAccount}).then(console.log);
        alert("Denied Request")
    }

    const getRentedProperties = async() => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(MyContract_abi, contractAddress);
        await contract.methods.getCurrentRentedProperties().call({from: defaultAccount}).
        then((res) =>{
            let propertyCount = res[0].length;
            let arr = [];
            for (var i=0; i< propertyCount ; i++) {
                for (var j=0; j<=7 ; j++){
                    if(j===0) {
                        arr[i] = res[j][i];
                    } else {
                        arr[i] += "," + res[j][i];
                    }
                }
            }

            for (var x = 0; x < arr.length ; x++) {
                properties.push(arr[x]);
            }
            
            for (var y=0; y<properties.length;y++){
                let arr2 = [];
                arr2 = properties[y].split(',');
                if( arr2[2] !== ''){
                    propertyId.push(arr2[0]);
                    propertyOwnerAddress.push(arr2[1]);
                    propertyOwnerContact.push(arr2[2]);
                    propertyLocation.push(arr2[3]);
                    propertyPrice.push(arr2[4]);
                    propertyTenantAddress.push(arr2[5]);
                    propertyTenantContact.push(arr[6]);
                    propertyOccupied.push(arr2[7]);
                }
            }
        });
    }

    const payRent = async(ownerAddress, rentPrice) => {
        const web3 = new Web3(window.ethereum);
        await new web3.eth.sendTransaction({to: ownerAddress, value: web3.utils.toWei(rentPrice), from: defaultAccount}).then(console.log);
        alert("Rent Paid")
    }

    window.ethereum.on('accountsChanged', accountChangedHandler);

    if(addPropertyButton ==='true'){
        return(
            <div className='Dashboard'>
                <div className='Content'>
                    <button className='button' onClick={handleAddPropertyButton}>Back to Dashboard</button>
                    <b><h2>Add Property</h2></b>
                    <form>
                        Location <br/>
                        <input className='input' type="text" value={location} onChange={handleLocationChange}/> <br/><br/>
                        Price (ETH per Month) <br/>
                        <input className='input' type="number" value={price} onChange={handlePriceChange}/> <br/>
                    </form><br/><br/>
                    <button className='button2' onClick={addPropertyOnBlockchain}>Add Property</button> <br/>
                </div>
            </div>
        )
    }else if (viewPropertyButton === 'true'){
        return(
            <div className='Dashboard'>
                <div className='Content'>
                    <button className='button' onClick={handleViewPropertyButton}>Back To Dashboard</button><br/><br/>
                    <b><h2>Properties</h2></b>
                    {properties.map((property, index) => (
                        <li className='list' key={index}>Location: <i> {propertyLocation[index]} </i>, Price: <i>{propertyPrice[index]}ETH</i>, Occupied: <i>{propertyOccupied[index]}</i> <br/> <button className='button2' onClick={e => requestProperty(propertyId[index],propertyOwnerAddress[index])}>Request Property</button></li>
                    ))}
                </div>
            </div>
        )
    } else if (viewLandLordPropertyButton === 'true'){
        return(
            <div className='Dashboard'>
                <div className='Content'>
                    <button className='button' onClick={handleViewLandLordPropertyButton}>Back To Dashboard</button>
                    <b><h2>My Properties</h2></b>
                    {landlordPropertyId.map((propertyIndex, index) => (
                        <li className="list" key={index}>Location: <i>{landlordPropertyLocation[index]}</i>, Price: <i>{landlordPropertyPrice[index]}ETH</i>, Occupied: <i>{landlordPropertyOccupied[index]}</i>, Tenant  Wallet Address:<i> {landlordPropertyTenant[index]}</i></li>
                    ))}
                </div>
            </div>
        )
    } else if(viewRequestsButton === 'true'){
        return(
            <div className='Dashboard'>
                <div className='Content'>
                    <button className='button' onClick={handleViewRequestsButton}>Back To Dashboard</button>
                    <b><h2>Property Requests</h2></b>
                    {requestId.map((requests, index) =>(
                        <li className="req-list" key={index}> Location: <i>{requestPropertyLocation[index]}</i>, Price: <i>{requestPropertyPrice[index]}ETH</i>, Requester Email: <i>{requestEmail[index]}</i>, <br/> <button className='button2' onClick={e => acceptRequest(requestId[index], requestPropertyId[index], requestFrom[index])}>Accept Request</button> <button className='button2' onClick={e => denyRequest(requestId[index])}>Deny Request</button></li>
                    ))}
                    <text style={{color: "red"}}>
                        <b>
                        Contact the Tenant and do neccessary checks before accepting requests.
                        </b>
                    </text>
                </div>
            </div>
        )
    } else if(rentedPropertyButton === 'true'){
        return(
            <div className='Dashboard'>
                <div className='Content'>
                <button className='button' onClick={handleRentedPropertyButton}>Back To Dashboard</button>
                <b><h2>Rented Properties</h2></b>
                {propertyId.map((property, index) => (
                    <li className="list" key={index}>Location: <i>{propertyLocation[index]}</i>, Price: <i>{propertyPrice[index]}ETH</i>, Landlord Email: <i>{propertyOwnerContact[index]}</i> <br/> <button className='button2' onClick={e => payRent(propertyOwnerAddress[index], propertyPrice[index])}>Pay Rent</button> </li>
                ))}
                </div>
            </div>
        )
    } else {
        return(
            <div className='Dashboard'>
                <div className='Content'>
                    <button className='button' onClick={connectWalletHandler}>{connectButtonText}</button>
                    <br/>
                    <br/><br/>
                    <button className='button' onClick={handleAddPropertyButton}>Add Property</button> 
                    <button className='button' onClick={handleViewPropertyButton}>View Properties</button> 
                    <button className='button' onClick={handleViewLandLordPropertyButton}>My Properties</button> 
                    <button className='button' onClick={handleViewRequestsButton}>Requests</button> 
                    <button className='button' onClick={handleRentedPropertyButton}>Rented Property</button>
                </div>
            </div>
        )
    }
};

export default DashboardBody;