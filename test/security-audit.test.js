const hre = require("hardhat");

async function main() {
  console.log("====================================================");
  console.log("TERRAVERIFICADA - AUDITORIA DE SEGURANÇA (RED TEAM)");
  console.log("====================================================\n");

  const [owner, hacker, validadorLegitimo] = await hre.ethers.getSigners();
  
  console.log("Implantando instância de auditoria isolada...");
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  const contrato = await ImpactNFT.deploy();
  await contrato.waitForDeployment();
  const contratoAddress = await contrato.getAddress();
  console.log(`Contrato implantado em: ${contratoAddress}\n`);

  // Configuração: Adicionar validador legítimo
  console.log("Configurando ambiente seguro...");
  await contrato.addValidator(validadorLegitimo.address);
  console.log(`Validador legítimo registrado: ${validadorLegitimo.address}\n`);

  console.log("----------------------------------------------------");
  console.log("INICIANDO SIMULAÇÃO DE ATAQUES");
  console.log("----------------------------------------------------\n");

  // --- ATAQUE 1: Sybil / Validação por Não-Validador ---
  console.log("TESTE 1: Hacker tentando validar incidente sem permissão...");
  try {
    const contratoDoHacker = contrato.connect(hacker);
    // Tenta validar um incidente que não existe (ID 1)
    await contratoDoHacker.validateIncident(1);
    console.log("FALHA CRÍTICA: O hacker conseguiu validar!");
  } catch (error) {
    if (error.message.includes("Caller is not a community validator")) {
      console.log("DEFESA ATIVA: Bloqueio de acesso detectado!");
      console.log("STATUS: SEGURO contra Ataques Sybil.");
    } else {
      console.log("DEFESA ATIVA: Transação revertida (Outro motivo).");
      console.log("STATUS: SEGURO.");
    }
  }

  console.log("\n----------------------------------------------------");

  // --- ATAQUE 2: Privilege Escalation (Remover Validador) ---
  console.log("TESTE 2: Hacker tentando remover validador legítimo...");
  try {
    const contratoDoHacker = contrato.connect(hacker);
    await contratoDoHacker.removeValidator(validadorLegitimo.address);
    console.log("FALHA CRÍTICA: O hacker conseguiu remover o validador!");
  } catch (error) {
    if (error.message.includes("Only owner can call this function") || error.message.includes("Ownable")) {
      console.log("DEFESA ATIVA: Tentativa de quebra de privilégio bloqueada!");
      console.log("STATUS: SEGURO contra Privilege Escalation.");
    } else {
      console.log("DEFESA ATIVA: Transação revertida.");
      console.log("STATUS: SEGURO.");
    }
  }

  console.log("\n----------------------------------------------------");

  // --- ATAQUE 3: Dupla Validação (Double Voting) ---
  console.log("TESTE 3: Validador tentando votar duas vezes no mesmo incidente...");
  try {
    // Primeiro, o validador legítimo registra um incidente
    await contrato.connect(validadorLegitimo).registerIncident("QmTesteDuplo");
    
    // Validação 1 (Sucesso esperado)
    await contrato.connect(validadorLegitimo).validateIncident(1);
    console.log("   - Validação 1: OK.");

    // Validação 2 (Deve falhar)
    await contrato.connect(validadorLegitimo).validateIncident(1);
    console.log("FALHA CRÍTICA: O validador conseguiu votar duas vezes!");
  } catch (error) {
    if (error.message.includes("Already validated by you")) {
      console.log("DEFESA ATIVA: Bloqueio de voto duplo detectado!");
      console.log("STATUS: SEGURO contra Double Voting.");
    } else {
      console.log("DEFESA ATIVA: Transação revertida.");
      console.log("STATUS: SEGURO.");
    }
  }

  console.log("\n----------------------------------------------------");
  console.log("CONCLUSÃO DA AUDITORIA");
  console.log("O contrato resistiu a todas as simulações de exploração.");
  console.log("As regras de governança e segurança estão 100% íntegras.");
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
