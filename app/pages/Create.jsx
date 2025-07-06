'use client';
import ConnectWallet from '../components/ConnectWallet';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { ethers, parseEther } from 'ethers';
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

  useEffect(() => {
    if (authenticated) {
      (async () => {
        const provider = getProvider();
        const addr = user.wallet.address;
        const name = await provider.lookupAddress(addr);
        if (name?.endsWith('.eth') || name?.endsWith('.base'))
          setEnsName(name.replace(/\.eth|\.base/, ''));
        const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, provider);
        setVerified(await factory.isVerifiedDev(addr));
      })();
    }
  }, [authenticated]);

  const verifyDev = async () => {
    try {
      const provider = getWeb3Provider();
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, signer);
      setStatus('Verifying ENS...');
      await (await factory.verifyDev(ensName)).wait();
      setStatus('Verified ✅');
      setVerified(true);
    } catch {
      setStatus('Verification failed ❌');
    }
  };

  const createCampaign = async () => {
    if (!repo || !liveUrl) {
      setStatus('Please provide GitHub repo and live URL');
      return;
    }
    try {
      const provider = getWeb3Provider();
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, signer);
      setStatus('Deploying...');
      await (
        await factory.createCrowdfund(parseEther(goal.toString()), duration * 86400)
      ).wait();
      setStatus('Campaign created ✅');
    } catch (e) {
      console.error(e);
      setStatus('Creation failed ❌');
    }
  };

  return (
    <div className="p-6">
      <ConnectWallet />
      <h1 className="text-2xl font-bold text-primary mb-4">Create Crowdfund</h1>
      {!authenticated ? (
        <p>Connect your wallet above.</p>
      ) : !verified ? (
        <>
          <p>ENS: <strong>{ensName || 'None'}</strong>.base</p>
          <button onClick={verifyDev} className="bg-secondary text-white px-4 py-2 rounded">
            Verify ENS
          </button>
        </>
      ) : (
        <>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(+e.target.value)}
            placeholder="Goal (ETH)"
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
            placeholder="Duration (days)"
            className="border p-2 w-full mb-2"
          />
          <input
            type="url"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="GitHub Repository URL"
            className="border p-2 w-full mb-2"
          />
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="Live Project URL"
            className="border p-2 w-full mb-4"
          />
          <button onClick={createCampaign} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Create
          </button>
        </>
      )}
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
