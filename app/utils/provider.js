import { JsonRpcProvider, BrowserProvider } from 'ethers';

export const getProvider = () => {
  return new JsonRpcProvider("https://mainnet.base.org"); // or your RPC URL
};

export const getWeb3Provider = () => {
  if (!window.ethereum) throw new Error("No wallet found");
  return new BrowserProvider(window.ethereum);
};
