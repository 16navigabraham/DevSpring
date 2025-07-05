import React from "react";
import { usePrivy, useLogin } from "@privy-io/react-auth";

const ConnectWallet = () => {
  const { login } = useLogin();
  const { authenticated, user, logout } = usePrivy();

  return (
    <div className="p-4">
      {authenticated ? (
        <div className="flex items-center justify-between">
          <p className="text-sm">Connected: {user.wallet.address}</p>
          <button onClick={logout} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={login} className="px-4 py-2 bg-primary text-white rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;