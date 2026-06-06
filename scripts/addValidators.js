const hre = require("hardhat");

async function main() {
  console.log("Adicionando validadores comunitários ao TerraVerificada...\n");

  // Endereço do contrato deployado
  const contractAddress = "0xA821477f669D74093Fc47eCd3095b9120Bc30a7f";
  
  // Obtenha o contrato
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  const impactNFT = ImpactNFT.attach(contractAddress);

  // Obtenha o deployer (única conta disponível)
  const [deployer] = await hre.ethers.getSigners();

  console.log(`Contrato: ${contractAddress}`);
  console.log(`Owner/Deployer: ${deployer.address}\n`);

  // Adicionar o deployer como primeiro validador
  console.log(" Adicionando validadores...");
  
  try {
    // Adiciona o deployer como primeiro validador
    console.log(`\n Adicionando validador: ${deployer.address}`);
    const tx1 = await impactNFT.addValidator(deployer.address);
    console.log(` Transação enviada: ${tx1.hash}`);
    await tx1.wait();
    console.log(` Validador 1 adicionado com sucesso!\n`);

    console.log("═══════════════════════════════════════════════════════");
    console.log(" PRÓXIMOS PASSOS PARA ADICIONAR MAIS VALIDADORES:");
    console.log("═══════════════════════════════════════════════════════\n");
    
    console.log("Para testar o consenso de 3 validações, você precisa de 3 carteiras diferentes.");
    console.log("Siga estes passos:\n");
    
    console.log("1️ Crie 2 novas carteiras no MetaMask (ou use contas do Hardhat local):\n");
    console.log("   - Carteira 2: _________________ (preencha após criar)");
    console.log("   - Carteira 3: _________________ (preencha após criar)\n");
    
    console.log("2️ Adicione ETH Sepolia nas novas carteiras (faucet: https://sepoliafaucet.com/)\n");
    
    console.log("3️ Adicione os validadores manualmente no Etherscan:\n");
    console.log(`   - Acesse: https://sepolia.etherscan.io/address/${contractAddress}#writeContract\n`);
    console.log("   - Clique na função 'addValidator'");
    console.log("   - Cole o endereço da Carteira 2 e clique em 'Write'");
    console.log("   - Cole o endereço da Carteira 3 e clique em 'Write'\n");
    
    console.log("4️ OU use este comando com as novas carteiras:\n");
    console.log("   npx hardhat run scripts/addMoreValidators.js --network sepolia\n");
    
    console.log("═══════════════════════════════════════════════════════\n");
    
    console.log("FLUXO DE TESTE DO CONSENSO:\n");
    console.log("   1. Carteira 1 (Deployer) → Registra incidente");
    console.log("   2. Carteira 2 → Valida (1/3)");
    console.log("   3. Carteira 3 → Valida (2/3)");
    console.log("   4. Qualquer carteira válida → Valida (3/3) → NFT EMITIDO!\n");
    
    console.log("DICA: Para desenvolvimento local, use múltiplas contas do Hardhat:");
    console.log("   npx hardhat node (em uma aba)");
    console.log("   npx hardhat run scripts/addValidators.js --network localhost (em outra)\n");

  } catch (error) {
    console.error("Erro ao adicionar validadores:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
