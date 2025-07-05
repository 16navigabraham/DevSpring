import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getWeb3Provider, getProvider } from "../utils/provider";
import { CROWDFUND_FACTORY } from "../utils/constants";
import CrowdfundFactoryABI from "../abi/CrowdfundFactory.json";
import { ethers } from "ethers";

const Create = () => {
  const { user, authenticated } = usePrivy();
  const [ensName, setEnsName] = useState("");
  const [goal, setGoal] = useState(1);
  const [duration, setDuration] = useState(7);
  const [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      resolveENS(user.wallet.address);
      checkVerification(user.wallet.address);
    }
  }, [authenticated]);

  const resolveENS = async (address) => {
    const provider = getProvider();
    const name = await provider.lookupAddress(address);
    if (name) {
      // Support both .eth and .base
      if (name.endsWith(".eth") || name.endsWith(".base")) {
        const shortName = name.replace(".eth", "").replace(".base", "");
        setEnsName(shortName);
      }
    }
  };

  const checkVerification = async (address) => {
    const provider = getProvider();
    const contract = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, provider);
    const verified = await contract.isVerifiedDev(address);
    setIsVerified(verified);
  };

  const verifyENS = async () => {
    try {
      const provider = getWeb3Provider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, signer);
      const tx = await contract.verifyDev(ensName);
      setStatus("Verifying ENS...");
      await tx.wait();
      setStatus("ENS verified!");
      setIsVerified(true);
    } catch (err) {
      console.error(err);
      setStatus("Verification failed");
    }
  };

  const createCampaign = async () => {
    try {
      const provider = getWeb3Provider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CROWDFUND_FACTORY, CrowdfundFactoryABI, signer);
      const tx = await contract.createCrowdfund(
        ethers.utils.parseEther(goal.toString()),
        duration * 86400
      );
      setStatus("Deploying campaign...");
      await tx.wait();
      setStatus("Campaign created successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Creation failed");
    }
  };

  if (!authenticated) return <p className="p-4">Please connect wallet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary">Create Crowdfund Campaign</h1>

      {!isVerified ? (
        <>
          <p className="mt-2">ENS name found: <strong>{ensName || "None"}</strong>.eth/.base</p>
          <button
            onClick={verifyENS}
            className="bg-secondary text-white px-4 py-2 rounded mt-4"
          >
            Verify ENS Ownership
          </button>
        </>
      ) : (
        <div className="space-y-3 mt-4">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            type="number"
            placeholder="Goal in ETH"
            className="border p-2"
          />
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            placeholder="Duration in days"
            className="border p-2"
          />
          <button onClick={createCampaign} className="bg-secondary text-white px-4 py-2 rounded">
            Create Campaign
          </button>
        </div>
      )}

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
};

export default Create;