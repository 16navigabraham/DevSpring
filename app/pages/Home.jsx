import ConnectWallet from '../components/ConnectWallet';
import CampaignCard from '../components/CampaignCard';
import ContributeModal from '../components/ContributeModal';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getProvider } from '../utils/provider';
import CrowdfundFactoryABI from '../abi/CrowdfundFactory.json';
import { CROWDFUND_FACTORY } from '../utils/constants';
import { getAvatar } from '../utils/ens';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    const i = setInterval(fetchCampaigns, 20000);
    return () => clearInterval(i);
  }, []);

  async function fetchCampaigns() {
    const p = getProvider();
    const factory = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, p);
    const addrs = await factory.getAllCampaigns();
    const arr = await Promise.all(addrs.map(async addr => {
      const c = new ethers.Contract(addr, CrowdfundFactoryABI, p);
      const goal = ethers.utils.formatEther(await c.goal());
      const balance = ethers.utils.formatEther(await p.getBalance(addr));
      const owner = await c.owner();
      const ens = await p.lookupAddress(owner);
      const avatar = ens ? await getAvatar(ens) : null;
      return { id: addr, title: addr.slice(0,6), owner: ens || owner, goal, balance, avatar };
    }));
    setCampaigns(arr);
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
