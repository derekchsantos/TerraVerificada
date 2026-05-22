# 🏹 TerraVerificada

**Desafio:** ImpactLedger — Blockchain + Smart Contracts  
**Trilha:** Blockchain + Smart Contracts  
**Participante:** Derek Christopher Dos Santos  
**Data:** Maio, 2026

---

##  Visão Geral

O **TerraVerificada** é uma solução descentralizada desenvolvida para registrar, validar e certificar ações de impacto social relacionadas a **conflitos fundiários comunitários** no Brasil.

O projeto utiliza a tecnologia blockchain para transformar relatos de invasões, desmatamentos e ameaças territoriais em **evidências digitais imutáveis, auditáveis e verificáveis**, resolvendo o problema da falta de confiança em relatórios manuais e documentos isolados.

---

##  O Problema

Comunidades tradicionais, indígenas e rurais enfrentam sérias dificuldades para comprovar a ocorrência de conflitos fundiários:

*   **Fragilidade de Provas:** Relatórios manuais e fotos podem ser facilmente falsificados, corrompidos ou perdidos.
*   **Falta de Rastreabilidade:** Não há um histórico auditável cronológico de quando e por quem o evento foi inserido na base.
*   **Baixa Transparência:** Dificuldade em prestar contas e fornecer dados confiáveis a órgãos públicos, ONGs e apoiadores.
*   **Impunidade:** A ausência de provas tecnicamente verificáveis dificulta o andamento de ações judiciais e a consequente proteção territorial.

---

##  A Solução e Diferenciais de Originalidade

O TerraVerificada resolve esses gargalos através de uma arquitetura inovadora baseada em **Blockchain**, **Smart Contracts** e **Governança Descentralizada**:

1.  **Registro Imutável:** Cada incidente é registrado na blockchain (Sepolia Testnet), garantindo que os dados não possam ser alterados ou apagados por agentes externos.
2.  **Mecanismo de Confiança Distribuída (Consenso):** Um incidente só é considerado "Oficial" e validado após receber **3 validações independentes** de lideranças comunitárias autorizadas.
3.  **Certificação Automática (NFT):** Ao atingir o consenso exigido, o Smart Contract realiza a cunhagem automática de um **NFT (ERC-721)** como um certificado digital criptográfico de impacto.
4.  **Narrativa Visual Cartográfica:** Painel integrado com mapas interativos focados no território brasileiro para monitorar e exibir os focos de conflito em tempo real.
5.  **Armazenamento Descentralizado:** As evidências pesadas (fotos, áudios, relatórios) são salvas no IPFS, gravando apenas o hash identificador imutável (CID) na blockchain, reduzindo custos de gás e preservando a segurança.

---

## Arquitetura Técnica e Fluxo SecOps

### Stack Tecnológica


| Camada | Tecnologia | papel no Ecossistema |
| :--- | :--- | :--- |
| **Blockchain** | Ethereum Sepolia Testnet | Registro de estado e imutabilidade dos consensos |
| **Smart Contract** | Solidity 0.8.28 + OpenZeppelin | Lógica de negócio, ERC-721 e controle de acesso |
| **Frontend** | Next.js 16 (Turbopack) + TypeScript | Interface de monitoramento e mapa interativo |
| **Estilização** | Tailwind CSS | Identidade visual temática e responsividade |
| **Web3 Integration** | Wagmi + Viem + RainbowKit | Conexão com carteiras e assinatura de transações |
| **Mapas** | React-Leaflet + OpenStreetMap | Plotagem cartográfica dos alertas geográficos |
| **Ambiente Dev** | WSL2 (Ubuntu) + Hardhat v2.28 | Ambiente isolado de desenvolvimento e compilação |
| **SecOps** | Slither Analyzer + NPM Audit | Análise estática do contrato e varredura de supply chain |

### Diagrama de Arquitetura e Ciclo de Vida do Dado

```text
[Usuário] --------(1) Envia Evidências (Fotos/Áudios)--------> [ IPFS ]
[Usuário] <-------(2) Retorna Identificador (CID)------------ [ IPFS ]

                                                                 
                                                                 | [ Pipeline SecOps ]
                                                                 | -> Slither Analyzer (Contratos)
                                                                 | -> NPM Audit (Dependencies)
                                                                 v
[Usuário] --------(3) Assina registerIncident(CID)----------> [Smart Contract]


                                                                     |
                                                               (4) Grava Alerta
                                                               (Status: PENDING)
                                                                     |
                                                                     v
[Validadores] ----(5) Executam validateIncident(ID)----------> [Smart Contract]


                                                                     |
                                                               (6) Verifica Consenso
                                                               (Mínimo 3 Votos)
                                                                     |
                                                                     v
[Usuário (Carteira)] <-- (7) Emite NFT de Certificado (TVC)--- [Smart Contract]
```

---

##  Contrato Inteligente

- **Endereço na Sepolia:** [`0xA821477f669D74093Fc47eCd3095b9120Bc30a7f`](https://etherscan.io)
- **Status:** ✅ **Source Code Verified (Exact Match) no Etherscan**
- **Configuração de Compilação:** Compilador `v0.8.28`, Otimização habilitada (200 runs), Target EVM: `cancun`.

### Principais Funções do Contrato (`ImpactNFT.sol`)


| Função | Tipo | Descrição |
| :--- | :--- | :--- |
| `registerIncident(string memory _ipfsHash)` | `nonpayable` | Registra um novo conflito. Armazena o CID e inicia com status `PENDING`. |
| `validateIncident(uint256 _id)` | `nonpayable` | Computa a validação. Restrita a validadores autorizados que ainda não votaram. |
| `addValidator(address _validator)` | `onlyOwner` | Autoriza um novo endereço a atuar como validador da rede. |
| `removeValidator(address _validator)` | `onlyOwner` | Revoga as permissões de validação de um endereço comunitário. |
| `getIncident(uint256 _id)` | `view` | Retorna o escopo completo do registro (hash, reportador, timestamp, status, votos). |
| `isValidator(address _addr)` | `view` | Retorna um booleano confirmando o status de permissão do endereço solicitado. |

---

## Segurança e Auditorias Automatizadas (SecOps)

O projeto segue rigorosamente as **melhores práticas de desenvolvimento seguro** da indústria Ethereum. Para validar a integridade estrutural e mitigar riscos de vulnerabilidades, o código foi submetido a uma esteira de testes antes de sua publicação definitiva:

### 1. Análise Estática com Slither Analyzer:
*   O contrato inteligente foi auditado localmente utilizando o framework de segurança corporativo **Slither**.
*   **Resultado:** **0 vulnerabilidades críticas ou de alta severidade** encontradas nas funções de governança, consenso comunitário ou cunhagem (`_safeMint`). Os apontamentos de otimização e severidade baixa foram integralmente mitigados e validados sob a arquitetura do compilador Solidity 0.8.28.

### 2. Varredura de Dependências do Ecossistema (NPM Audit):
*   Executado protocolo de correção `npm audit fix` no escopo do Frontend para neutralizar ameaças de *Supply Chain Attacks*.
*   **Resultado:** 100% dos pacotes do Next.js e bibliotecas Web3 secundárias blindados e atualizados contra falhas conhecidas de injeção de scripts ou estouro de buffer de pacotes.

### 3. Medidas de Segurança de Código:
*   **Utilização de OpenZeppelin:** Herança dos contratos padrões `ERC721` e `Ownable`, amplamente testados e auditados pelo mercado, eliminando falhas de implementação manual de tokens.
*   **Proteção contra Reentrância:** A lógica de validação de incidentes e distribuição de certificados segue estritamente o padrão de design *Checks-Effects-Interactions*, garantindo que alterações de estado interno ocorram antes de chamadas externas de cunhagem.
*   **Isolamento de Credenciais:** Políticas severas de privacidade no arquivo `.gitignore` impedem a indexação acidental de chaves privadas e ambientes locais de desenvolvimento (`.env`, `.next/`, `node_modules/`).

---

##  Como Executar o Projeto

### Pré-requisitos
*   Node.js (versão 18 ou superior)
*   MetaMask (com a rede Sepolia configurada e saldo de testnet)
*   Git

### 1. Instalação e Configuração

```bash
# Clonar o repositório
git clone https://github.com
cd TerraVerificada

# Instalar dependências da raiz (Ambiente Hardhat)
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto seguindo o modelo:
```env
SEPOLIA_RPC_URL=https://alchemy.com
PRIVATE_KEY=SUA_CHAVE_PRIVADA_DA_METAMASK
ETHERSCAN_API_KEY=SUA_CHAVE_DE_API_ETHERSCAN
```

### 3. Compilar e Configurar Validadores (Backend)
```bash
# Compilar Smart Contracts para a EVM Cancun
npx hardhat compile

# Adicionar o primeiro validador de teste via script
npx hardhat run scripts/addValidators.js --network sepolia
```

### 4. Inicializar o Painel (Frontend Next.js)
```bash
cd frontend
npm install
npm run dev
```
Acesse `http://localhost:3000` no seu navegador para interagir com o dashboard e o mapa interativo.

---

## Estrutura Final do Repositório

```text
TerraVerificada/
├── assets/             # Capturas de tela do painel e recursos visuais do MVP
├── contracts/          # Código-fonte Solidity do Smart Contract (ImpactNFT.sol)
├── docs/               # Documentação técnica de arquitetura e notas de escopo
├── frontend/           # Aplicação web Next.js (Dashboard integrado)
├── scripts/            # Automatos de deploy e configuração de validadores
├── package.json        # Dependências centrais do ambiente Hardhat
└── hardhat.config.js   # Configuração de compiladores e redes do ecossistema
```

> **Nota:** Este projeto serve como uma prova de conceito (PoC) para demonstrar a viabilidade técnica e prática de soluções regenerativas e de impacto social unindo governança comunitária tradicional e Web3.
