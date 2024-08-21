// src/views/Home.vue

<template>
  <div class="apartment-list">
    <div v-for="apt in apartments" :key="apt.id" class="apartment-card">
      <strong>{{ apt.name }}</strong>
      <p>{{ apt.location }}</p>
      <p>{{ web3.utils.fromWei(apt.price, "ether") }} ETH</p>
    </div>
  </div>
</template>

<script>
import { initializeWeb3, getWeb3 } from '../web3Service';
import { initContract, getContract } from '../contractService';
import Web3 from "web3";

export default {
  data() {
    return {
      apartments: [],
      web3: null,
      contract: null,
      wallet: null,
    };
  },
  async created() {
    try {
      this.web3 = await initializeWeb3();
      await this.loadAccount();
      await this.loadContract();
      await this.loadApartments();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  },

  // async created() {
  //     await this.loadWeb3();
  //     await this.loadAccount();
  //     await this.loadContract();
  //     await this.loadApartments(); 
  //   },

  methods: {

    async loadWeb3() {
        if (window.ethereum) {
          this.web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } else if (window.web3) {
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.error("No Ethereum browser is installed. Try installing MetaMask.");
        }
      },

    async loadAccount() {
      try {
        const accounts = await this.web3.eth.getAccounts();
        this.wallet = accounts[0];
        console.log( this.wallet)
      } catch (error) {
        console.log("errorrrrr account ");
        console.error('Error loading account:', error);
      }
    },

    async loadContract() {
        try {
          const res = await fetch("/ApartmentContract.json");
          const contractJSON = await res.json();
          const { abi, networks } = contractJSON;
  
          const networkId = await this.web3.eth.net.getId();
          const networkData = networks[networkId];
  
          if (!networkData) {
            throw new Error('Contract not deployed on detected network');
          }
  
          const contractAddress = networkData.address;
          this.contract = new this.web3.eth.Contract(abi, contractAddress);
          console.log("Contract: ", this.contract);
        } catch (error) {
          console.error('Error loading contract:', error);
        }
      },

    async loadApartments() {
      try {
        const apartmentCount = await this.contract.methods
          .apartmentCounter()
          .call();
        const apartments = [];

        for (let i = 1; i <= apartmentCount; i++) {
          const apt = await this.contract.methods.apartments(i).call();
          apartments.push(apt);
        }

        this.apartments = apartments;
        console.log(this.apartments);
      } catch (error) {
        console.error("Error loading apartments:", error);
      }
    },

    async createApartment() {
      try {
        const accounts = await this.web3.eth.getAccounts();
        await this.contract.methods
          .createApartment(
            this.Apartment.name,
            this.Apartment.location,
            this.web3.utils.toWei(this.Apartment.price, "ether")
          )
          .send({ from: accounts[0] });

        // Clear the input fields
        this.Apartment = {
          name: "",
          location: "",
          price: "",
        };

        // Reload the list of apartments
        await this.loadApartments();
      } catch (error) {
        console.error("Error creating apartment:", error);
      }
    },

    async signOut() {
      try {
        // Disconnect the wallet (simulate by setting wallet to null)
        this.wallet = null;
        
        // Request the user to connect a new account
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Update the wallet with the new account
        this.wallet = accounts[0];
        console.log("Connected to new wallet:", this.wallet);
      } catch (error) {
        console.error("Error connecting to new wallet:", error);
      }
    },
  },
};
</script>

<style scoped>
.apartment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.apartment-card {
  background-color: #333;
  color: #fff;
  padding: 20px;
  width: calc(33% - 20px);
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
