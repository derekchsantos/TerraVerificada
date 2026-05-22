# 🏹 TerraVerificada

**Desafio:** ImpactLedger — Blockchain + Smart Contracts  
**Trilha:** Blockchain + Smart Contracts  
**Participante:** Derek Christopher Dos Santos  
**Data:** Maio, 2026

---

## Visão Geral

O **TerraVerificada** é uma solução descentralizada desenvolvida para registrar, validar e certificar ações de impacto social relacionadas a **conflitos fundiários comunitários** no Brasil.

O projeto utiliza a tecnologia blockchain para transformar relatos de invasões, desmatamentos e ameaças territoriais em **evidências digitais imutáveis, auditáveis e verificáveis**, resolvendo o problema da falta de confiança em relatórios manuais e documentos isolados.

---

## O Problema

Comunidades tradicionais, indígenas e rurais enfrentam sérias dificuldades para comprovar a ocorrência de conflitos fundiários:

*   **Fragilidade de Provas:** Relatórios manuais e fotos podem ser facilmente falsificados, corrompidos ou perdidos.
*   **Falta de Rastreabilidade:** Não há um histórico auditável cronológico de quando e por quem o evento foi inserido na base.
*   **Baixa Transparência:** Dificuldade em prestar contas e fornecer dados confiáveis a órgãos públicos, ONGs e apoiadores.
*   **Impunidade:** A ausência de provas tecnicamente verificáveis dificulta o andamento de ações judiciais e a consequente proteção territorial.

---

## A Solução e Diferenciais de Originalidade

O TerraVerificada resolve esses gargalos através de uma arquitetura inovadora baseada em **Blockchain**, **Smart Contracts** e **Governança Descentralizada**:

1.  **Registro Imutável:** Cada incidente é registrado na blockchain (Sepolia Testnet), garantindo que os dados não possam ser alterados ou apagados por agentes externos.
2.  **Mecanismo de Confiança Distribuída (Consenso):** Um incidente só é considerado "Oficial" e validado após receber **3 validações independentes** de lideranças comunitárias autorizadas.
3.  **Certificação Automática (NFT):** Ao atingir o consenso exigido, o Smart Contract realiza a cunhagem automática de um **NFT (ERC-721)** como um certificado digital criptográfico de impacto.
4.  **Narrativa Visual Cartográfica:** Painel integrado com mapas interativos focados no território brasileiro para monitorar e exibir os focos de conflito em tempo real.
5.  **Armazenamento Descentralizado:** As evidências pesadas (fotos, áudios, relatórios) são salvas no IPFS, gravando apenas o hash hash identificador imutável (CID) na blockchain, reduzindo custos de gás e preservando a segurança.

---

## Aquitetura Técnica

### Stack Tecnológica


| Camada | Tecnologia |
| :--- | :--- |
| **Blockchain** | Ethereum Sepolia Testnet |
| **Smart Contract** | Solidity 0.8.28 + OpenZeppelin Contracts |
| **Frontend** | Next.js 16 (Turbopack) + TypeScript |
| **Estilização** | Tailwind CSS (Paleta de Identidade Visual Temática) |
| **Web3 Integration** | Wagmi + Viem + RainbowKit (Reown Project ID) |
| **Mapas** | React-Leaflet + OpenStreetMap |
| **Ambiente Dev** | WSL2 (Ubuntu) + Hardhat v2.28 + Python venv |

### Fluxo de Funcionamento

```text
[Usuário] --------(1) Envia Evidências (Fotos/Áudios)--------> [ IPFS ]
[Usuário] <-------(2) Retorna Identificador (CID)------------ [ IPFS ]
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

## Contrato Inteligente

- **Endereço na Sepolia:** [`0xA821477f669D74093Fc47eCd3095b9120Bc30a7f`](https://sepolia.etherscan.io/address/0xA821477f669D74093Fc47eCd3095b9120Bc30a7f#code)
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

## Como Executar o Projeto

### Pré-requisitos
*   Node.js (versão 18 ou superior)
*   MetaMask (com a rede Sepolia configurada e saldo de testnet)
*   Git

### 1. Instalação e Configuração

```bash
# Clonar o repositório
git clone https://github.com/SEU_USERNAME/TerraVerificada.git
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

### 3. Compilar e Testar Contratos (Backend)
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

## Segurança e Boas Práticas

Embora este seja um MVP desenvolvido para um hackathon e não tenha passado por uma auditoria profissional de terceiros, o projeto segue rigorosamente as **melhores práticas de desenvolvimento seguro** da indústria Ethereum:

### Medidas de Segurança Implementadas:
1.  **Utilização de OpenZeppelin:**
    *   O contrato herda de `ERC721` e `Ownable` da biblioteca **OpenZeppelin**, que é o padrão ouro da indústria, testada e auditada por milhares de projetos. Isso elimina vulnerabilidades comuns de implementação manual de tokens e governança.
2.  **Proteção contra Reentrância:**
    *   A lógica de transferência de NFTs e validação foi desenhada para seguir estritamente o padrão de design *Checks-Effects-Interactions* (Verificações-Efeitos-Interações). A cunhagem de segurança ocorre apenas após as alterações internas de estado, mitigando ataques de reentrância clássicos.
3.  **Controle de Acesso Rigoroso:**
    *   Funções de alta criticidade administrativa (`addValidator`, `removeValidator`, `rejectIncident`) são protegidas globalmente pelo modificador `onlyOwner`.
    *   A função `validateIncident` verifica explicitamente a identidade do assinante através da validação do mapeamento `isValidator`.
4.  **Versionamento Seguro:**
    *   Utilização de compiladores modernos da linha **Solidity 0.8+**, que incluem proteções nativas contra erros aritméticos clássicos de estouro de memória (*overflow* e *underflow*).
5.  **Isolamento de Credenciais:**
    *   Políticas severas de privacidade no arquivo `.gitignore` impedem a indexação de chaves privadas e ambientes locais de desenvolvimento (`.env`, `.next/`, `node_modules/`).

### Limitações Conhecidas (Escopo MVP):
*   **Auditoria Externa:** Este código não passou por uma auditoria formal de segurança de terceiros. Para uso em produção com valores operacionais ou financeiros reais, uma auditoria de firma especializada é mandatória.
*   **Oráculos de Dados:** A validação da veracidade física do incidente (ex: se o arquivo de mídia anexado corresponde ao local real) depende exclusivamente da reputação e honestidade dos validadores humanos autorizados. A blockchain garante a integridade e perenidade do registro de forma imutável pós-consenso, mas não impede a inserção original de dados falsos por validadores comprometidos.
*   **Gestão de Chaves:** A segurança final do ecossistema depende inteiramente da guarda segura e do sigilo das chaves privadas associadas aos endereços dos validadores.

---

## Estrutura Final do Repositório

```text
TerraVerificada/
├── assets/             # Capturas de tela do painel e recursos visuais do MVP
├── contracts/          # Código-fonte Solidity do Smart Contract (ImpactNFT.sol)
├── docs/               # Documentação técnica de arquitetura e notas de escopo
├── frontend/           # Aplicação web Next.js (Dashboard integrado)
├── scripts/            # Automações de deploy e configuração de validadores
├── package.json        # Dependências centrais do ambiente Hardhat
└── hardhat.config.js   # Configuração de compiladores e redes do ecossistema
```

> **Nota:** Este projeto serve como uma prova de conceito (PoC) para demonstrar a viabilidade técnica e prática de soluções regenerativas e de impacto social unindo governança comunitária tradicional e Web3.
