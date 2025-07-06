'use client';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  const handleAction = async (path) => {
    if (!authenticated) {
      await login(); // Prompt Privy login
    }
    router.push(path);
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/30 backdrop-blur-sm z-0" />
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/crowdfund-bg.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
          Support Onchain Builders
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up delay-100">
          Discover and fund verified developers building the future on Base.
        </p>

        <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up delay-200">
          <button
            onClick={() => handleAction('/create')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-semibold shadow-lg transition-transform transform hover:scale-105"
          >
            Create a Campaign
          </button>

          <button
            onClick={() => handleAction('/campaigns')}
            className="px-6 py-3 bg-white text-teal-700 hover:bg-gray-100 rounded-md font-semibold shadow-lg transition-transform transform hover:scale-105"
          >
            Join Campaigns
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.3s;
        }
        .delay-200 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
