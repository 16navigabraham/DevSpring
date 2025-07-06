'use client';
import Link from 'next/link';
import HomeContent from '../components/Home';

export default function HomePage() {
  return (
    <div className="p-6">
      <header className="flex justify-between items-center bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Crowdfundme</h1>
        <Link href="/create">
          <a className="bg-white text-primary px-4 py-2 rounded">Create</a>
        </Link>
      </header>
      <HomeContent />
    </div>
  );
}
