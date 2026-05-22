"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

// IMPORTAÇÃO EXPLICITA DO JSON DO CONTRATO
import contractData from '../config/contract.json';

const CONTRACT_ADDRESS = contractData.address;
const IMPACT_NFT_ABI = contractData.abi;

// CORREÇÃO: Alterado de MapComponent para GeoMap para bater com a linha da renderização
const GeoMap = dynamic(() => import('@/components/GeoMap'), { 
  ssr: false,
  loading: () => <div className="text-stone-500 animate-pulse p-4">Carregando dados cartográficos...</div>
});

// DEFAULT EXPORT
export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [ipfsInput, setIpfsInput] = useState("");

  // LEITURA: Busca o contador total de incidentes direto do Smart Contract
  const { data: totalIncidents } = useReadContract({
    abi: IMPACT_NFT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'incidentCounter',
  });

  // Coordenadas geográficas fictícias atreladas ao mapa para demonstração no Pitch
  const mockGeoIncidents = [
    { id: 1, title: "Reserva Indígena X - Invasão de Limite", lat: -11.12, lng: -53.45, status: "Aguardando Consenso (1/3)" },
    { id: 2, title: "Território Ancestral Y - Garimpo Ilegal", lat: -3.11, lng: -60.02, status: "Confirmado (3/3)" }
  ];

  // ENVIO: Função disparada pelo botão para registrar o incidente na blockchain Sepolia
  const handleRegister = async () => {
    if (!ipfsInput) return alert("Insira o Hash do IPFS!");
    
    writeContract({
      abi: IMPACT_NFT_ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'registerIncident',
      args: [ipfsInput],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* HEADER PRINCIPAL */}
      <header className="bg-[#1C3D27] text-[#FDFBF7] py-4 px-6 shadow-md border-b-4 border-[#A34828] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏹</span>
          <h1 className="text-xl font-bold tracking-wider uppercase">TerraVerificada</h1>
        </div>
        
        {/* Espaço de conexão Web3 */}
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <span className="bg-emerald-900/50 border border-emerald-500 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-mono">
              {address?.slice(0,6)}...{address?.slice(-4)}
            </span>
          ) : (
            <button className="bg-[#A34828] hover:bg-[#85391E] text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm">
              Conectar Carteira
            </button>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA DA ESQUERDA */}
        <section className="lg:col-span-1 flex flex-col space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-lg font-bold text-[#1C3D27] mb-3 flex items-center">
              <span className="mr-2"></span> Reportar Conflito Fundiário
            </h2>
            <p className="text-sm text-stone-600 mb-4">
              Insira as evidências salvas no IPFS para iniciar o consenso comunitário.
            </p>
            
            <input 
              type="text"
              placeholder="Hash do IPFS (Qm...)"
              value={ipfsInput}
              onChange={(e) => setIpfsInput(e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-[#A34828] text-stone-800"
            />

            <button 
              onClick={handleRegister}
              disabled={isPending}
              className="w-full bg-[#1C3D27] hover:bg-[#132B1B] text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {isPending ? "Processando na Carteira..." : "+ Registrar na Blockchain"}
            </button>
          </div>

          {/* MONITORAMENTO INTEGRADO */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Monitoramento Local</h3>
              <span className="bg-stone-100 text-stone-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Total: {totalIncidents?.toString() || "0"}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {mockGeoIncidents.map((item) => (
                <div key={item.id} className="p-3 bg-stone-50 rounded-xl border-l-4 border-[#D49B35]">
                  <div className="flex justify-between text-xs font-semibold text-stone-500">
                    <span>ID: #{item.id}</span>
                    <span className="text-[#D49B35]">{item.status}</span>
                  </div>
                  <p className="text-sm font-bold mt-1 text-stone-800">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COLUNA DA DIREITA: MAPA INTERATIVO REAL */}
        <section className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 flex-1 flex flex-col min-h-[500px]">
            <div className="mb-3 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1C3D27]">Mapa Geográfico de Evidências</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-full">Rede: Sepolia</span>
            </div>
            
            {/* CONTAINER DO MAPA REAL */}
            <div className="flex-1 w-full h-full rounded-xl overflow-hidden bg-stone-100 relative">
              {/* Agora o componente bate perfeitamente com a declaração dinâmica do topo */}
              <GeoMap incidents={mockGeoIncidents} />            
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-100 text-center py-4 text-xs text-stone-500 border-t border-stone-200">
        <p>TerraVerificada &copy; 2026 - Proteção territorial baseada em consenso comunitário descentralizado.</p>
      </footer>
    </div>
  );
}
