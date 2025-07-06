import { ethers } from 'ethers';
import { RPC_URL } from './constants';
export const getProvider = () => new ethers.providers.JsonRpcProvider(RPC_URL);
export const getWeb3Provider = () => new ethers.providers.Web3Provider(window.ethereum);
