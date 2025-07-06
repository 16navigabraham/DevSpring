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
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (authenticated) {
      (async () => {
        const p = getProvider();
        const addr = user.wallet.address;
        const name = await p.lookupAddress(addr);
        if (name?.endsWith('.eth') || name?.endsWith('.base'))
          setEnsName(name.replace(/\.eth|\.base/, ''));
        const f = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, p);
        setVerified(await f.isVerifiedDev(addr));
      })();
    }
  }, [authenticated]);

  const verifyDev = async () => {
    try {
      const w3 = getWeb3Provider();
      const f = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, w3.getSigner());
      setStatus('Verifying ENS...');
      await (await f.verifyDev(ensName)).wait();
      setStatus('Verified ✅');
      setVerified(true);
    } catch {
      setStatus('Verification failed ❌');
    }
  };

  const createCampaign = async () => {
    try {
      const w3 = getWeb3Provider();
      const f = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, w3.getSigner());
      setStatus('Deploying...');
      await (await f.createCrowdfund(
        ethers.utils.parseEther(goal.toString()),
        duration * 86400
      )).wait();
      setStatus('Campaign created ✅');
    } catch {
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
          <p>ENS: <strong>{ensName || 'None'}</strong>.eth/.base</p>
          <button onClick={verifyDev} className="bg-secondary text-white px-4 py-2 rounded">Verify ENS</button>
        </>
      ) : (
        <>
          <input type="number" value={goal} onChange={e => setGoal(+e.target.value)} placeholder="Goal (ETH)" className="border p-2 w-full mb-2" />
          <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} placeholder="Duration (days)" className="border p-2 w-full mb-2" />
          <button onClick={createCampaign} className="bg-secondary text-white px-4 py-2 rounded w-full">Create</button>
        </>
      )}
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
