import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CROWDFUND_FACTORY } from "../utils/constants";
import { getProvider } from "../utils/provider";
import CrowdfundFactoryABI from "../abi/CrowdfundFactory.json";
import CampaignCard from "../components/CampaignCard";
import { getAvatar } from "../utils/ens";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
    const interval = setInterval(fetchCampaigns, 20000); // poll every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    const provider = getProvider();
    const contract = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, provider);
    const addresses = await contract.getAllCampaigns();

    const details = await Promise.all(
      addresses.map(async (addr) => {
        const c = new ethers.Contract(addr, CrowdfundFactoryABI, provider);
        const goal = await c.goal();
        const balance = await provider.getBalance(addr);
        const owner = await c.owner();
        const ensName = await provider.lookupAddress(owner);
        const avatar = ensName ? await getAvatar(ensName) : null;
        return {
          title: `Campaign @ ${addr.substring(0, 6)}...`,
          goal: ethers.utils.formatEther(goal),
          balance: ethers.utils.formatEther(balance),
          owner: ensName || owner,
          avatar
        };
      })
    );

    setCampaigns(details);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">All Crowdfund Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((c, i) => <CampaignCard key={i} {...c} />)}
      </div>
    </div>
  );
};

export default Home;