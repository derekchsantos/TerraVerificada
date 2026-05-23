"use client";
import React, { useState, useRef } from 'react'; // Adicionado 'useRef'
import dynamic from 'next/dynamic';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

// IMPORTAÇÃO EXPLICITA DO JSON DO CONTRATO
import contractData from '../config/contract.json';
// IMPORTAÇÃO DA CRIPTOGRAFIA
import { encryptFile } from '../lib/cryptoUtils';

const CONTRACT_ADDRESS = contractData.address;
const IMPACT_NFT_ABI = contractData.abi;

// CORREÇÃO: Alterado de MapComponent para GeoMap para bater com a linha da renderização
const GeoMap = dynamic(() => import('@/components/GeoMap'), { 
  ssr: false,
  loading: () => <div className="text-stone-500 animate-pulse p-4">Carregando dados cartográficos...</div>
});

// TODO: Integrar com IPFS real (Pinata/Web3.Storage)
// Atualmente uso um hash simulado para agilizar a demo.
// O próximo passo é implementar o upload real de arquivos.
  
// TODO: Adicionar validadores 2 e 3 para o consenso completo
// O contrato suporta 3 validações, mas para a demo usei apenas 1
// para evitar dependência de múltiplas carteiras no vídeo.

// DEFAULT EXPORT
export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  // Estados existentes
  const [ipfsInput, setIpfsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // --- NOVOS ESTADOS PARA CRIPTOGRAFIA ---
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Referência para o input de arquivo

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

  // --- NOVA FUNÇÃO DE UPLOAD CRIPTOGRAFADO ---
  const handleUploadToIPFS = async () => {
    if (!fileInputRef.current?.files[0]) {
      alert("Por favor, selecione um arquivo (foto/documento) primeiro!");
      return;
    }

    setUploading(true);
    const file = fileInputRef.current.files[0];

    try {
      // 1. Criptografar o arquivo localmente (AES-256)
      const { encryptedBlob, key } = await encryptFile(file);
      setEncryptionKey(key); // Guarda a chave na memória (em prod, mostraria para o usuário baixar)

      // 2. Simular upload do arquivo CRIPTOGRAFADO para IPFS
      // (Aqui você usaria o SDK do Pinata com o encryptedBlob)
      // Para demo, vamos gerar um hash falso indicando que é criptografado
      const mockEncryptedHash = `Encrypted_Qm${Math.random().toString(36).substring(2, 15)}...`;
      
      setIpfsInput(mockEncryptedHash); // Atualiza o input com o hash
      
      alert(`Arquivo CRIPTOGRAFADO e pronto para envio!\n\n Privacidade: O arquivo foi criptografado no seu navegador.\n Chave gerada (salva na memória para demo).\n📡 Hash: ${mockEncryptedHash}`);
      
      console.log("Chave secreta (não compartilhe em produção):", key);
      
    } catch (error) {
      console.error("Erro na criptografia:", error);
      alert("Erro ao criptografar arquivo. Verifique o console.");
    } finally {
      setUploading(false);
    }
  };

  // ENVIO: Função disparada pelo botão para registrar o incidente na blockchain Sepolia
  const handleRegister = async () => {
    if (!ipfsInput) return alert("Insira o Hash do IPFS (faça o upload primeiro)!");
    
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
              Insira as evidências. <strong>Os arquivos são criptografados</strong> antes de ir para o IPFS.
            </p>
            
            {/* INPUT DE ARQUIVO (NOVO) */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-stone-700 mb-1">1. Selecione a Evidência</label>
              <input 
                type="file"
                ref={fileInputRef}
                className="block w-full text-sm text-stone-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#1C3D27] file:text-white
                  hover:file:bg-[#132B1B]
                "
              />
            </div>

            {/* BOTÃO DE UPLOAD CRIPTOGRAFADO */}
            <button 
              onClick={handleUploadToIPFS}
              disabled={uploading || !fileInputRef.current?.files[0]}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition disabled:opacity-50 mb-3 flex items-center justify-center gap-2"
            >
              {uploading ? 'Criptografando...' : 'Criptografar & Enviar para IPFS'}
            </button>

            {/* INPUT DE HASH (APARECE DEPOIS DO UPLOAD) */}
            {ipfsInput && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-stone-700 mb-1">2. Hash Criptografado (IPFS)</label>
                <input 
                  type="text"
                  readOnly
                  value={ipfsInput}
                  className="w-full bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-600 font-mono"
                />
                {encryptionKey && (
                  <p className="text-xs text-green-600 mt-1">Chave de descriptografia gerada (simulação).</p>
                )}
              </div>
            )}

            <button 
              onClick={handleRegister}
              disabled={!ipfsInput || isPending}
              className="w-full bg-[#1C3D27] hover:bg-[#132B1B] text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              {isPending ? 'Processando na Carteira...' : '+ Registrar na Blockchain'}
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
              <GeoMap incidents={mockGeoIncidents} />            
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-100 text-center py-4 text-xs text-stone-500 border-t border-stone-200">
        <p>TerraVerificada &copy; 2026 - Proteção territorial baseada em consenso comunitário descentralizado.</p>
        <p className="mt-1 text-[10px]">Criptografia AES-256 aplicada às evidências.</p>
      </footer>
    </div>
  );
}
