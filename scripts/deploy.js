//@author Derek Christopher Dos Santos

const hre = require("hardhat");

async function main() {
  console.log("Iniciando o deploy do ImpactNFT na rede Sepolia...");

  // Obtém a fábrica do contrato
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  
  // Inicia a implantação
  const contract = await ImpactNFT.deploy();

  // Aguarda o deploy ser finalizado na blockchain
  await contract.waitForDeployment();

  // Obtém o endereço do contrato publicado
  const contractAddress = await contract.getAddress();

  console.log("\n================================================");
  console.log("Contrato ImpactNFT implantado com sucesso!");
  console.log(`Endereço do Contrato: ${contractAddress}`);
  console.log("================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
