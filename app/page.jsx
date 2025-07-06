'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Make sure framer-motion is installed

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center bg-gray-900"
      style={{ backgroundImage: "url('/crowdfund-bg.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/30 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        {isMounted && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            >
              Welcome to CrowdfundMe
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg md:text-xl mb-8 max-w-xl"
            >
              Create or support web3 crowdfunding campaigns by verified ENS developers on Base.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex gap-4"
            >
              <Link href="/create">
                <button className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out">
                  Create Campaign
                </button>
              </Link>
              <Link href="/campaigns">
                <button className="bg-white hover:bg-gray-200 text-primary px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out">
                  Explore Campaigns
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
