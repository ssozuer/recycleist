import Web3 from "web3";
import RecycleistContract from './contracts/Recycleist.json';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0xf02dB988e473258E07479a0BF0205D88B3Ffd1F1";
let recycleist = new web3.eth.Contract(RecycleistContract.abi, contractAddress);
export default recycleist;