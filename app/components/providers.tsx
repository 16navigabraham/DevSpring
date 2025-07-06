'use client';
import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

export const Providers = ({ children }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        embeddedWallets: { createOnLogin: 'users-without-wallets' },
        appearance: { theme: 'light', accentColor: '#00897B' },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
