// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ApartmentContract  {

    address public owner;
    uint256 public apartmentCounter = 0;

    constructor() {
        owner = msg.sender;
    }

    struct Apartment {
        uint256 id;
        string name;
        string location;
        uint256 price;
        bool isBought;
        uint256 boughtAt;
    }

    struct Buyer {
        address payable walletAddress;
        string firstName;
        string lastName;
        uint256 balance;
        uint256 due;
        uint256 boughtApartmentId;
    }

    event ApartmentCreated(
        uint256 id,
        string name,
        string location,
        uint256 price,
        bool isBought,
        uint256 boughtAt
    );

    mapping(uint256 => Apartment) public apartments;
    mapping(address => Buyer) public buyers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function createApartment(string memory _name, string memory _location, uint256 _price) public onlyOwner {
        apartmentCounter++;
        apartments[apartmentCounter] = Apartment(
            apartmentCounter,
            _name,
            _location,
            _price,
            false,
            0
        );
        emit ApartmentCreated(
            apartmentCounter,
            _name,
            _location,
            _price,
            false,
            0
        );
    }

    function buyApartment(uint256 apartmentId) public payable   {
        Apartment storage apartment = apartments[apartmentId];
        require(!apartment.isBought, "Apartment already bought");
        require(msg.value >= apartment.price, "Insufficient funds to buy the apartment");

        // Mark the apartment as bought
        apartment.isBought = true;
        apartment.boughtAt = block.timestamp;

        // Update buyer's details
        Buyer storage buyer = buyers[msg.sender];
        if (buyer.walletAddress == address(0)) {
            // Add new buyer if not already existing
            buyer.walletAddress = payable(msg.sender);
        }
        buyer.balance += msg.value;
        buyer.boughtApartmentId = apartmentId;

        // Transfer funds to owner
        payable(owner).transfer(msg.value);

        // Emit event
        emit ApartmentCreated(
            apartmentId,
            apartment.name,
            apartment.location,
            apartment.price,
            apartment.isBought,
            apartment.boughtAt
        );
    }

    function getApartment(uint256 id) public view returns (Apartment memory) {
        return apartments[id];
    }

    function getBuyer(address buyerAddress) public view returns (Buyer memory) {
        return buyers[buyerAddress];
    }
}
