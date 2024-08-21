import Web3 from 'web3';

let web3 = null;
let contract = null;

export async function initContract() {
  if (contract) return contract; // Return existing contract if already initialized

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    throw new Error('No Ethereum browser is installed. Try installing MetaMask.');
  }

  try {
    const res = await fetch("/ApartmentContract.json");
    const contractJSON = await res.json();
    const { abi, networks } = contractJSON;

    const networkId = await web3.eth.net.getId();
    const networkData = networks[networkId];

    if (!networkData) {
      throw new Error('Contract not deployed on detected network');
    }

    const contractAddress = networkData.address;
    contract = new web3.eth.Contract(abi, contractAddress);
    return contract;
  } catch (error) {
    console.error('Error loading contract:', error);
    throw error;
  }
}

export function getWeb3() {
  return web3;
}

export function getContract() {
  return contract;
}
