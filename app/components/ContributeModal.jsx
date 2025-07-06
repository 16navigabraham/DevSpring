'use client';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { getWeb3Provider } from '../utils/provider';
import CrowdfundABI from '../abi/Crowdfund.json';
 // Ensure correct ABI import

export default function ContributeModal({ isOpen, onClose, campaign }) {
  const [amount, setAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const contribute = async () => {
    const provider = getWeb3Provider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(campaign.id, CrowdfundABI, signer);
    const tx = await contract.contribute({
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <Dialog.Panel className="fixed inset-y-1/4 left-1/4 right-1/4 bg-white p-6 rounded">
        <Dialog.Title>Contribute to {campaign.title}</Dialog.Title>
        <p>Raised: {campaign.balance} / {campaign.goal} ETH</p>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="border p-2 w-full mt-2"
        />
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
          />
          <span className="ml-2 text-sm">I confirm I've read the details.</span>
        </label>
        <button
          disabled={!confirmed}
          onClick={contribute}
          className={`mt-4 w-full py-2 rounded ${
            confirmed ? 'bg-primary text-white' : 'bg-gray-300'
          }`}
        >
          Contribute
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full py-2 rounded bg-secondary text-white"
        >
          Back
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
