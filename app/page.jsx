'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { login, authenticated, ready } = usePrivy();
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
    <div className="h-screen w-full bg-animated text-white flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4 animate-fade-in-up">
        Welcome to CrowdfundMe
      </h1>
      <p className="text-lg md:text-xl max-w-xl animate-fade-in-up mb-8">
        Create or support Web3 crowdfunding campaigns by verified ENS developers on Base.
      </p>

      <div className="flex gap-4 animate-fade-in-up">
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
  );
}
