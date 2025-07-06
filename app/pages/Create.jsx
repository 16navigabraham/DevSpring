'use client';
import ConnectWallet from '../components/ConnectWallet';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CrowdfundFactoryABI from '../abi/CrowdfundFactory.json';
import { getProvider, getWeb3Provider } from '../utils/provider';
import { CROWDFUND_FACTORY } from '../utils/constants';

export default function Create() {
  const { authenticated, user } = usePrivy();
  const [ensName, setEnsName] = useState('');
  const [goal, setGoal] = useState(1);
  const [duration, setDuration] = useState(7);
  const [repo, setRepo] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('');

  const address = user?.wallet?.address;

  useEffect(() => {
    if (authenticated && address) {
      (async () => {
        const provider = getProvider();
        const name = await provider.lookupAddress(address);
        if (name?.endsWith('.eth') || name?.endsWith('.base')) {
          setEnsName(name.replace(/\.eth|\.base/, ''));
        }
        const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, provider);
        const isDev = await factory.isVerifiedDev(address);
        setVerified(isDev);
      })();
    }
  }, [authenticated, address]);

  const verifyDev = async () => {
    try {
      const web3 = getWeb3Provider();
      const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, web3.getSigner());
      setStatus('Verifying ENS...');
      await (await factory.verifyDev(ensName)).wait();
      setStatus('Verified ✅');
      setVerified(true);
    } catch (err) {
      console.error(err);
      setStatus('Verification failed ❌');
    }
  };

  const createCampaign = async () => {
    if (!repo || !liveUrl) {
      setStatus('GitHub repo and Live URL required ❗');
      return;
    }
    try {
      const web3 = getWeb3Provider();
      const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, web3.getSigner());
      setStatus('Deploying campaign...');
      await (await factory.createCrowdfund(
        ethers.utils.parseEther(goal.toString()),
        duration * 86400
      )).wait();
      setStatus('Campaign created ✅');
    } catch (err) {
      console.error(err);
      setStatus('Campaign creation failed ❌');
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <ConnectWallet />
      <h1 className="text-2xl font-bold text-primary mb-4">Create Crowdfund</h1>

      {!authenticated ? (
        <p>Please connect your wallet above.</p>
      ) : !verified ? (
        <>
          <p className="mb-2">ENS Detected: <strong>{ensName || 'None'}</strong>.eth/.base</p>
          <button
            onClick={verifyDev}
            className="bg-secondary text-white px-4 py-2 rounded transition hover:bg-secondary-dark"
          >
            Verify ENS
          </button>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <input
              type="number"
              value={goal}
              onChange={e => setGoal(+e.target.value)}
              placeholder="Funding Goal (in ETH)"
              className="border p-2 w-full rounded"
            />
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(+e.target.value)}
              placeholder="Duration (in days)"
              className="border p-2 w-full rounded"
            />
            <input
              type="url"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="GitHub Repo URL"
              className="border p-2 w-full rounded"
            />
            <input
              type="url"
              value={liveUrl}
              onChange={e => setLiveUrl(e.target.value)}
              placeholder="Live Project URL"
              className="border p-2 w-full rounded"
            />
            <button
              onClick={createCampaign}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded w-full transition duration-150"
            >
              Launch Campaign 🚀
            </button>
          </div>
        </>
      )}

      {status && (
        <p className="mt-4 text-sm text-gray-700">{status}</p>
      )}
    </div>
  );
}
// This code is a React component for creating a crowdfunding campaign.
// It allows users to connect their wallet, verify their ENS name, and set up campaign details
// like funding goal, duration, GitHub repo, and live URL.
// The component uses the Privy authentication library to manage user sessions and wallet connections.
// It interacts with a smart contract to verify developers and create campaigns on the blockchain.
// The UI is styled with Tailwind CSS classes for a modern look and feel.
// The component handles state management for user inputs and feedback messages during the process.
// It also includes error handling for blockchain interactions and displays appropriate messages to the user.
// The code is structured to ensure a smooth user experience with clear instructions and feedback.
// The component is designed to be reusable and maintainable, following best practices in React development.
// It uses hooks like useEffect for side effects and state management with useState.
// The component is ready to be integrated into a larger application, providing essential functionality for crowdfunding campaigns