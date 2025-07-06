'use client';
import { usePrivy, useLogin } from '@privy-io/react-auth';

export default function ConnectWallet() {
  const { login } = useLogin();
  const { authenticated, user, logout } = usePrivy();

  return (
    <div className="p-4 flex justify-end">
      {authenticated ? (
        <>
          <span className="mr-2 text-sm">{user.wallet.address}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </>
      ) : (
        <button onClick={login} className="bg-primary text-white px-4 py-2 rounded">Connect Wallet</button>
      )}
    </div>
  );
}
