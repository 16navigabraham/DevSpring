import React from "react";

const CampaignCard = ({ title, owner, goal, balance, avatar }) => (
  <div className="border p-4 rounded-xl shadow-md bg-white">
    <h2 className="text-xl font-bold text-secondary">{title}</h2>
    {avatar && <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full mt-2" />}
    <p className="text-sm">By: {owner}</p>
    <p>Goal: {goal} ETH</p>
    <p>Raised: {balance} ETH</p>
    <button className="bg-primary text-white px-4 py-2 rounded mt-2">Support</button>
  </div>
);

export default CampaignCard;