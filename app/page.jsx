'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    if (authenticated && redirectPath) {
      router.push(redirectPath);
    }
  }, [authenticated, redirectPath, router]);

  const handleNavigation = (path) => {
    if (!authenticated) {
      setRedirectPath(path);
      login(); // Trigger Privy login
    } else {
      router.push(path);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-teal-900 via-green-800 to-teal-700 flex justify-center items-center px-4">
      <div className="glass-card max-w-2xl text-center text-white animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          🚀 Welcome to <span className="text-secondary">CrowdfundMe</span>
        </h1>
        <p className="text-base md:text-lg mb-8">
          Create or support Web3 crowdfunding campaigns by verified developers on Base.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleNavigation('/create')}
            className="btn btn-primary"
          >
            Create Campaign
          </button>
          <button
            onClick={() => handleNavigation('/campaigns')}
            className="btn btn-secondary"
          >
            Explore Campaigns
          </button>
        </div>
      </div>
    </div>
  );
}
