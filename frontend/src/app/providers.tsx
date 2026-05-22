'use client';

import React from 'react';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from '../lib/wagmi';

// Importação obrigatória dos estilos globais do RainbowKit
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Mantendo o tema Light para combinar com a nossa paleta estética indígena */}
        <RainbowKitProvider 
          theme={lightTheme({
            accentColor: '#A34828', // Cor urucum / terracota para botões da carteira
            accentColorForeground: 'white',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
