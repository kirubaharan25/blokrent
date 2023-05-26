pragma solidity ^0.8.18;

contract MyContract {

    struct Property {
        uint index;
        bytes32 id;
        address owner;
        string ownerContact;
        string location;
        uint rentPrice;
        address tenant;
        string tenantContact;
        bool occupied;
    }

    Property[] propertiesArr;
    mapping(address => bytes32) internal tenantsToProperty;
    mapping(bytes32 => Property) internal properties;

    //Function to add a property
    function addProperty(string memory _ownerContact, string memory _location, uint _rentPrice) public returns(bytes32 id){
        id = keccak256(abi.encodePacked(_ownerContact, _location, _rentPrice));
        Property memory property = Property(propertiesArr.length, id, msg.sender, _ownerContact, _location, _rentPrice, address(0), '', false);
        properties[id] = property;
        propertiesArr.push(property);
        return (id);
    }

    //Function to get all properties
    function getProperties() public view returns(bytes32[] memory, address[] memory, string[] memory, string[] memory, uint[] memory, address[] memory, string[] memory, bool[] memory){
        bytes32[] memory ids = new bytes32[](propertiesArr.length);
        address[] memory Owner  = new address[](propertiesArr.length);
        string[] memory ownerContact = new string[](propertiesArr.length);
        string[] memory locations = new string[](propertiesArr.length);
        uint[] memory price = new uint[](propertiesArr.length);
        address[] memory Tenant = new address[](propertiesArr.length);
        string[] memory tenantContact = new string[](propertiesArr.length);
        bool[] memory Occupied = new bool[](propertiesArr.length);

        for(uint i=0; i < propertiesArr.length; i++) {
            ids[i] = propertiesArr[i].id;
            Owner[i] = propertiesArr[i].owner;
            ownerContact[i] = propertiesArr[i].ownerContact;
            locations[i] = propertiesArr[i].location;
            price[i] = propertiesArr[i].rentPrice;
            Tenant[i] = propertiesArr[i].tenant;
            tenantContact[i] = propertiesArr[i].tenantContact;
            Occupied[i] = propertiesArr[i].occupied;
        }  

        return (ids, Owner, ownerContact, locations, price, Tenant, tenantContact, Occupied);
    }

    // Function to get all of the landlords properties
    function getLandlordProperties() public view returns( bytes32[] memory, address[] memory, string[] memory, string[] memory, uint[] memory, address[] memory, string[] memory, bool[] memory){
        bytes32[] memory ids = new bytes32[](propertiesArr.length);
        address[] memory Owner  = new address[](propertiesArr.length);
        string[] memory ownerContact = new string[](propertiesArr.length);
        string[] memory locations = new string[](propertiesArr.length);
        uint[] memory price = new uint[](propertiesArr.length);
        address[] memory Tenant = new address[](propertiesArr.length);
        string[] memory tenantContact = new string[](propertiesArr.length);
        bool[] memory Occupied = new bool[](propertiesArr.length);

        for(uint i=0; i < propertiesArr.length; i++) {
            if (propertiesArr[i].owner == msg.sender) {
                ids[i] = propertiesArr[i].id;
                Owner[i] = propertiesArr[i].owner;
                ownerContact[i] = propertiesArr[i].ownerContact;
                locations[i] = propertiesArr[i].location;
                price[i] = propertiesArr[i].rentPrice;
                Tenant[i] = propertiesArr[i].tenant;
                tenantContact[i] = propertiesArr[i].tenantContact;
                Occupied[i] = propertiesArr[i].occupied;
            }
        }

        return (ids, Owner, ownerContact, locations, price, Tenant, tenantContact, Occupied);
    }

    struct Request {
        bytes32 id;
        bytes32 propertyId;
        address to;
        address from;
        string email;
    }

    Request[] requestsArr;
    mapping(bytes32 => Request[]) internal propertiesToRequests;
    mapping(bytes32 => Request) internal rentRequests;

    // Function used to send hire request to landlords
    function requestProperty(bytes32 _propertyId, address _to, string memory _email) public returns (bool success){
        bytes32 id = keccak256(abi.encodePacked(_propertyId, _to, msg.sender));
        Request memory request = Request(id, _propertyId, _to, msg.sender, _email);
        rentRequests[id] = request;
        propertiesToRequests[id].push(request);
        requestsArr.push(request);
        success = true;
    }

    // Function to get all hire requests sent to a landlord
    function getRentRequest() public view returns(bytes32[] memory, bytes32[] memory, address[] memory, string[] memory){
        bytes32[] memory ids = new bytes32[](requestsArr.length);
        bytes32[] memory pId = new bytes32[](requestsArr.length);
        address[] memory from = new address[](requestsArr.length);
        string[] memory email = new string[](requestsArr.length);

        for (uint i = 0; i<requestsArr.length; i++) {
            if (requestsArr[i].to == msg.sender){
                ids[i] = requestsArr[i].id;
                pId[i] = requestsArr[i].propertyId;
                from[i] = requestsArr[i].from;
                email[i] = requestsArr[i].email;
            }
        }

        return (ids, pId, from, email);
    }


    // Function to accept rent request
    function acceptRentRequest(bytes32 _requestId, bytes32 _property, address _pendingTenant, string memory _email) public returns(bool success) {
        properties[_property].tenant = _pendingTenant;
        propertiesArr[properties[_property].index].tenant = _pendingTenant;
        propertiesArr[properties[_property].index].tenantContact = _email;

        for (uint i =0; i<requestsArr.length ; i++){
            if (requestsArr[i].id == _requestId) {
                delete requestsArr[i];
                break;
            }
        }

        delete rentRequests[_requestId];
        delete propertiesToRequests[_requestId];
        properties[_property].occupied = true;
        propertiesArr[properties[_property].index].occupied = true;
        success = true;
    }

    // Function to deny rent request
    function denyRentRequest(bytes32 _requestId) public returns(bool success) {
        for (uint i =0; i<requestsArr.length ; i++){
            if (requestsArr[i].id == _requestId) {
                delete requestsArr[i];
                break;
            }
        }

        delete rentRequests[_requestId];
        delete propertiesToRequests[_requestId];
        success = true;

    }

    // Function to get rented properties
    function getCurrentRentedProperties() public view returns(bytes32[] memory,  address[] memory, string[] memory, string[] memory, uint[] memory, address[] memory, string[] memory, bool[] memory){
        bytes32[] memory ids = new bytes32[](propertiesArr.length);
        address[] memory Owner  = new address[](propertiesArr.length);
        string[] memory ownerContact = new string[](propertiesArr.length);
        string[] memory locations = new string[](propertiesArr.length);
        uint[] memory price = new uint[](propertiesArr.length);
        address[] memory Tenant = new address[](propertiesArr.length);
        string[] memory tenantContact = new string[](propertiesArr.length);
        bool[] memory Occupied = new bool[](propertiesArr.length);

        for(uint i=0; i < propertiesArr.length; i++) {
            if (propertiesArr[i].tenant == msg.sender) {
                ids[i] = propertiesArr[i].id;
                Owner[i] = propertiesArr[i].owner;
                ownerContact[i] = propertiesArr[i].ownerContact;
                locations[i] = propertiesArr[i].location;
                price[i] = propertiesArr[i].rentPrice;
                Tenant[i] = propertiesArr[i].tenant;
                tenantContact[i] = propertiesArr[i].tenantContact;
                Occupied[i] = propertiesArr[i].occupied;
            }
        }
        return (ids,  Owner, ownerContact, locations, price, Tenant, tenantContact, Occupied);
    }
}