const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Iniciando deploy do TerraVerificada na Sepolia...");

  // 1. Deploy do Contrato
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  const impactNFT = await ImpactNFT.deploy();

  await impactNFT.waitForDeployment();
  const contractAddress = await impactNFT.getAddress();

  console.log(`Contrato implantado em: ${contractAddress}`);

  // 2. Adicionar Validadores (Simulação de 3 líderes comunitários)
  // NOTA: Em produção, você adicionaria endereços reais de líderes.
  // Aqui, vamos adicionar a própria carteira do deployer e duas outras (você pode mudar depois).
  const [deployer, validator1, validator2] = await hre.ethers.getSigners();
  
  console.log("Adicionando validadores comunitários...");
  
  // Adiciona o deployer como validador 1
  await impactNFT.addValidator(deployer.address);
  console.log(`   - Validador 1: ${deployer.address}`);

  // Adiciona duas outras carteiras (substitua por endereços reais se tiver)
  // Para demo, vamos usar endereços aleatórios ou você pode criar contas no Hardhat
  // Vamos usar as contas 1 e 2 do Hardhat se estiver em local, ou endereços fixos para demo
  // Para simplificar a demo, vamos adicionar o deployer novamente (apenas para teste) ou criar lógica
  // MELHOR: Vamos adicionar o deployer e duas contas simuladas (você pode alterar no script)
  
  // Simulação: Adicionando o deployer como os 3 validadores para teste rápido (em prod, use endereços reais)
  // Se quiser testar com múltiplas contas, use: npx hardhat run scripts/deploy.js --network sepolia --account 0
  // Aqui vamos apenas adicionar o deployer 3 vezes para garantir que funcione na demo, 
  // mas a lógica do contrato impede duplicatas. 
  // Vamos adicionar o deployer e duas outras contas que você pode configurar no .env ou manualmente.
  
  // Para fins de demo rápida, vamos adicionar o deployer e duas contas "fantasmas" (você pode mudar)
  // Na prática, você rodaria isso e depois adicionaria os validadores reais via TX na blockchain.
  
  console.log("Nota: Para a demo, adicione os validadores reais manualmente via Etherscan ou script.");
  console.log("Use a função 'addValidator' com os endereços dos líderes comunitários.");

  // 3. Salvar endereço em um arquivo para o frontend ler
  const configPath = path.join(__dirname, "../frontend/src/config/contract.json");
  if (!fs.existsSync(path.dirname(configPath))) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
  }
  
  const configData = {
    address: contractAddress,
    network: "sepolia",
    chainId: 11155111,
    abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/ImpactNFT.sol/ImpactNFT.json"), "utf8")).abi
  };

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  console.log(`Configuração salva em: ${configPath}`);

  // 4. Verificação no Etherscan (opcional, se tiver API key)
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: []
    });
    console.log("Contrato verificado no Etherscan!");
  } catch (error) {
    console.log("Não foi possível verificar automaticamente. Verifique manualmente no Etherscan.");
    console.log(`Link: https://sepolia.etherscan.io/address/${contractAddress}#code`);
  }

  console.log("\n Deploy concluído!");
  console.log(`   Endereço do Contrato: ${contractAddress}`);
  console.log(`   Explorer: https://sepolia.etherscan.io/address/${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
