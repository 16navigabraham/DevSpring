// app/pages/Home.jsx
'use client';
import ConnectWallet from '../components/ConnectWallet';
import CampaignCard from '../components/CampaignCard';
import ContributeModal from '../components/ContributeModal';
import { useEffect, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import { getProvider } from '../utils/provider';
import CrowdfundFactoryABI from '../abi/CrowdfundFactory.json';
import CrowdfundABI from '../abi/Crowdfund.json';
import { CROWDFUND_FACTORY } from '../utils/constants';
import { getAvatar } from '../utils/ens';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 20000);
    return () => clearInterval(interval);
  }, []);

  async function fetchCampaigns() {
    const provider = getProvider();
    const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, provider);
    const addresses = await factory.getAllCampaigns();
    const data = await Promise.all(addresses.map(async (addr) => {
      const c = new ethers.Contract(addr, CrowdfundABI, provider);
      const goal = formatEther(await c.goal());
      const balance = formatEther(await provider.getBalance(addr));
      const owner = await c.owner();
      const ens = await provider.lookupAddress(owner);
      const avatar = ens ? await getAvatar(ens) : null;
      return {
        id: addr,
        title: addr.slice(0, 6),
        owner: ens || owner,
        goal,
        balance,
        avatar,
      };
    }));
    setCampaigns(data);
  }

  return (
    <div className="p-6">
      <ConnectWallet />
      <h1 className="text-3xl font-bold text-primary mb-4">Crowdfund Campaigns</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {campaigns.map(c => (
          <CampaignCard key={c.id} {...c} onContribute={setCurrent} />
        ))}
      </div>
      {current && (
        <ContributeModal
          isOpen={!!current}
          onClose={() => setCurrent(null)}
          campaign={campaigns.find(c => c.id === current)}
        />
      )}
    </div>
  );
}
