<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand style="color: white;" href="#">Apartment Rental</b-navbar-brand>
  
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item style="color: white;" href="/">Home</b-nav-item>
            <b-nav-item style="color: white;" href="/list-apartment">List Apartment</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
        <b-nav-item-dropdown right>
            <template #button-content>
              <p style="color: white;">{{ wallet ? wallet : 'User' }}</p>
            </template>
            <b-dropdown-item @click="signOut()" href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar>
      
      <!-- Aquí se mostrará el contenido de las rutas -->
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import Web3 from "web3";
  
  export default {
    data() {
      return {
        wallet: '',
      };
    },
  
    async created() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
      },
  
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
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          this.wallet = accounts[0];
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
    }
  }
  </script>
  