// src/web3Services.js

import Web3 from 'web3';

let web3 = null;

export async function initializeWeb3() {

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      } else {
        console.error("No Ethereum browser is installed. Try installing MetaMask.");
      }

//   if (window.ethereum) {
//     try {
//       web3 = new Web3(window.ethereum);
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const networkId = await web3.eth.net.getId();
//       console.log('Network ID:', networkId);
//     } catch (error) {
//       console.error('Error initializing Web3:', error);
//       throw new Error('Could not initialize Web3. Please check MetaMask and your network connection.');
//     }
//   } else if (window.web3) {
//     web3 = new Web3(window.web3.currentProvider);
//   } else {
//     console.error('No Ethereum browser is installed. Try installing MetaMask.');
//     throw new Error('No Ethereum browser is installed. Try installing MetaMask.');
//   }
  return web3;
}



export function getWeb3() {
  if (!web3) {
    throw new Error('Web3 is not initialized');
  }
  return web3;
}
