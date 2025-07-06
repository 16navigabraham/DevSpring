export default function CampaignCard({ id, title, owner, goal, balance, avatar, onContribute }) {
  return (
    <div className="border p-4 rounded-xl bg-white">
      <h3 className="text-xl font-bold text-secondary">{title}</h3>
      {avatar && <img src={avatar} className="w-10 h-10 rounded-full" alt="avatar" />}
      <p>Owner: {owner}</p>
      <p>Goal: {goal} ETH</p>
      <p>Raised: {balance} ETH</p>
      <button onClick={() => onContribute(id)} className="mt-2 bg-primary text-white px-3 py-1 rounded">Contribute</button>
    </div>
  );
}
