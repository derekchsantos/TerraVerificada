const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImpactNFT", function () {
  let impactNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ImpactNFT = await ethers.getContractFactory("ImpactNFT");
    impactNFT = await ImpactNFT.deploy();
    await impactNFT.waitForDeployment();
  });

  describe("Registro de Incidentes", function () {
    it("Deve registrar um novo incidente", async function () {
      const ipfsHash = "QmTeste123456789";
      
      const tx = await impactNFT.connect(addr1).registerIncident(ipfsHash);
      await tx.wait();

      const incident = await impactNFT.getIncident(1);
      
      expect(incident.id).to.equal(1);
      expect(incident.ipfsHash).to.equal(ipfsHash);
      expect(incident.reporter).to.equal(addr1.address);
      expect(incident.status).to.equal(0); // 0 = PENDING
    });

    it("Deve incrementar o contador de incidentes", async function () {
      await impactNFT.registerIncident("Qm1");
      await impactNFT.registerIncident("Qm2");

      const counter = await impactNFT.incidentCounter();
      expect(counter).to.equal(2);
    });
  });

  describe("Validação de Consenso", function () {
    it("Deve exigir validador para validar", async function () {
      await impactNFT.registerIncident("Qm1");
      
      // Tenta validar sem ser validador (deve falhar)
      await expect(
        impactNFT.connect(addr2).validateIncident(1)
      ).to.be.revertedWith("Caller is not a community validator");
    });

    it("Deve emitir NFT após 3 validações (simulado)", async function () {
      // Adiciona validadores
      await impactNFT.addValidator(owner.address);
      await impactNFT.addValidator(addr1.address);
      await impactNFT.addValidator(addr2.address);

      await impactNFT.registerIncident("Qm1");

      // Validações
      await impactNFT.connect(owner).validateIncident(1);
      await impactNFT.connect(addr1).validateIncident(1);
      
      // Antes da 3ª, não deve ter NFT
      expect(await impactNFT.ownerOf(1)).to.be.reverted;

      // 3ª Validação
      await expect(impactNFT.connect(addr2).validateIncident(1))
        .to.emit(impactNFT, "CertificateIssued");
      
      // Após 3ª, deve ter NFT
      expect(await impactNFT.ownerOf(1)).to.equal(impactNFT.address); // Ou o reporter, dependendo da lógica
    });
  });
});
