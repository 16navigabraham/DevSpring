import React, { useState } from 'react';
import { BrowserProvider, parseEther } from 'ethers';
import CrowdfundABI from '../abi/Crowdfund.json';

const ContributeModal = ({ isOpen, onClose, campaign }) => {
  const [amount, setAmount] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('');

  const contribute = async () => {
    if (!agreed || !amount) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(campaign.id, CrowdfundABI, signer);

      const tx = await contract.contribute({ value: parseEther(amount) });
      await tx.wait();

      setStatus('✅ Contribution successful!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Contribution failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">{campaign.title}</h2>
        <p>Goal: {campaign.goal} ETH</p>
        <p>Raised: {campaign.balance} ETH</p>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="border w-full p-2 my-2"
        />
        <label className="flex items-center space-x-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          <span>I understand I’m contributing onchain</span>
        </label>
        <div className="flex justify-between">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button
            disabled={!agreed || !amount}
            className={`px-4 py-2 rounded ${agreed && amount ? 'bg-blue-500 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={contribute}
          >
            Contribute
          </button>
        </div>
        {status && <p className="text-sm mt-2">{status}</p>}
      </div>
    </div>
  );
};

export default ContributeModal;
