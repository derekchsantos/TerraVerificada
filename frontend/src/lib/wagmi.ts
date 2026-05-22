import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TerraVerificada',
  projectId: 'e90c8c82d20e27a3331d5dc182cf4e8f', // <<< Cole o ID gerado da Reown aqui
  chains: [sepolia],
  ssr: true,
});
