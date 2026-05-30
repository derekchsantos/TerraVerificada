# 🏹 TerraVerificada

**Desafio:** ImpactLedger — Blockchain + Smart Contracts  
**Trilha:** Blockchain + Smart Contracts  
**Participante:** Derek Christopher Dos Santos  
**Data:** Maio, 2026

---

## Links Rápidos do Projeto

*   [Vídeo de Pitch Comercial (YouTube)](https://youtu.be/mKjSKEYJ5ls)
*   [Vídeo de Demonstração e Testes (YouTube)](https://youtu.be/6PCglqQ0Nms)
*   [Contrato Inteligente Verificado (Sepolia Etherscan)](https://etherscan.io)


---

## Visão Geral

O **TerraVerificada** é uma infraestrutura Web3 descentralizada desenvolvida para registrar, validar e certificar ações de impacto social relacionadas a **conflitos fundiários e ambientais** no Brasil.

O projeto utiliza tecnologia blockchain para transformar relatos de invasões, desmatamentos e ameaças territoriais em **evidências digitais imutáveis, criptografadas e auditáveis**, eliminando a dependência de relatórios manuais centralizados e vulneráveis à adulteração.

---

## O Problema e as "Gambiarras" do Mercado

Comunidades tradicionais, indígenas e rurais enfrentam sérias barreiras para comprovar violações territoriais:

*   **Fragilidade e Fraude de Provas:** Arquivos locais e mídias em servidores centrais podem ser facilmente apagados, alterados ou forjados por invasores.
*   **Quebra da Cadeia de Custódia:** Inexistência de um histórico cronológico imutável que comprove a autoria e o momento exato de geração do dado.
*   **Vulnerabilidade à Censura:** Dependência de infraestruturas centralizadas e bancos de dados locais sujeitos a ataques de negação de serviço (DoS) ou remoção coercitiva de informações.
*   **Invalidez Jurídica Imediata:** Provas isoladas recolhidas no campo que carecem de chaves criptográficas válidas para processos de auditoria legal em tribunais.

---

##  A Solução e Diferenciais de Originalidade

O TerraVerificada resolve esses gargalos integrando as tecnologias de governança Web3 e criptografia de ponta a ponta:

1.  **Cadeia de Custódia Imutável via Ledger:** Cada incidente gera um hash perene gravado na rede de testes Ethereum Sepolia, impossibilitando a exclusão ou modificação por agentes externos.
2.  **Privacidade e Criptografia Local (AES-256):** Antes de subir qualquer evidência (fotos/áudios) para o armazenamento compartilhado, os dados sensíveis são criptografados no navegador do usuário via chave simétrica AES-256, garantindo a inviolabilidade das mídias.
3.  **Mecanismo Antifraude Distribuído (Consenso):** Um alerta só atinge o status de "Confirmado" se obtiver o aval assinado de pelo menos **3 validadores independentes** credenciados pela comunidade local.
4.  **Cunhagem Autônoma de Impacto (NFT ERC-721):** Assim que o consenso comunitário é alcançado, o contrato executa de forma autônoma a cunhagem de um token não fungível como um certificado digital auditável para o reportador.
5.  **Persistência Descentralizada Off-Chain (IPFS):** Arquivos pesados residem em nós distribuídos do IPFS, gravando em cadeia somente os CIDs gerados, o que otimiza as taxas de gás na rede de execução (EVM).
6.  **Painel Cartográfico Integrado:** Interface dotada de inteligência geográfica para exibição em tempo real dos status das fronteiras vigiadas.

---

## Inteligência de Mercado (TAM / SAM / SOM)

O projeto está inserido na vanguarda da conformidade corporativa ESG, governança territorial e proteção climática:

*   **TAM (Mercado Total):** Mercado global de softwares de auditoria, rastreabilidade agrícola e tecnologias de conformidade socioambientais.
*   **SAM (Mercado Endereçável):** Monitoramento e salvaguarda de terras públicas, posses privadas reguladas e territórios ancestrais mapeados sob estresse ambiental na Amazônia Legal.
*   **SOM (Mercado de Entrada):** Cooperativas agrícolas baseadas em critérios rígidos de exportação, fundos de investimento de impacto e ONGs de monitoramento sediadas na região Norte do Brasil.

---

## Arquitetura Técnica e Fluxo SecOps

### Stack Tecnológica


| Camada | Tecnologia | Papel no Ecossistema |
| :--- | :--- | :--- |
| **Blockchain** | Ethereum Sepolia Testnet | Registro de estado definitivo e imutabilidade dos consensos |
| **Smart Contract** | Solidity 0.8.28 + OpenZeppelin | Lógica de negócio parametrizada, padrão ERC-721 e controle de acesso |
| **Frontend** | Next.js 16 (Turbopack) + TypeScript | Interface de monitoramento dinâmico e renderização cartográfica |
| **Criptografia** | Web Crypto API (AES-256-GCM) | Cifragem local de mídias e coordenadas geográficas pré-upload |
| **Web3 Integration** | Wagmi + Viem + RainbowKit | Conexão segura de carteiras cripto e assinatura digital de transações |
| **Mapas** | React-Leaflet + OpenStreetMap | Plotagem geográfica de nós e alertas territoriais em tempo real |
| **Ambiente Dev** | WSL2 (Ubuntu) + Hardhat v2.28 | Compilação isolada, gerenciamento de scripts de implantação e testes |
| **SecOps** | Slither Analyzer + NPM Audit | Verificação estática de bytecode e mapeamento de dependências |

### Diagrama de Arquitetura e Ciclo de Vida do Dado

```text
[Usuário] --------(1) Criptografa Mídias Localmente (AES-256) ------> [ Memória Local ]
[Usuário] --------(2) Faz o upload das mídias cifradas -----------> [ IPFS ]
[Usuário] <-------(3) Retorna Identificador Imutável (CID) -------- [ IPFS ]



                                                                 
                                                                 | [ Pipeline SecOps ]
                                                                 | -> Slither Analyzer (Contratos)
                                                                 | -> NPM Audit (Dependencies)
                                                                 v
[Usuário] --------(4) Assina registerIncident(CID) ---------------> [Smart Contract]



                                                                     |
                                                               (5) Grava Alerta
                                                               (Status: PENDING)
                                                                     |
                                                                     v
[Validadores] ----(6) Executam validateIncident(ID) --------------> [Smart Contract]



                                                                     |
                                                               (7) Verifica Consenso
                                                               (Mínimo 3 Votos)
                                                                     |
                                                                     v
[Usuário (Carteira)] <-- (8) Emite NFT de Certificado (TVC) ------- [Smart Contract]
```

---

## Contrato Inteligente

- **Endereço na Sepolia:** [`0xA821477f669D74093Fc47eCd3095b9120Bc30a7f`](https://etherscan.io)
- **Status:** ✅ **Source Code Verified (Exact Match) no Etherscan**
- **Configuração de Compilação:** Compilador `v0.8.28`, Otimização habilitada (200 runs), Target EVM: `cancun`.

### Principais Funções do Contrato (`ImpactNFT.sol`)


| Função | Tipo | Descrição |
| :--- | :--- | :--- |
| `registerIncident(string memory _ipfsHash)` | `nonpayable` | Insere um novo conflito. Associa o CID gerado ao endereço do emissor e inicia o status como `PENDING`. |
| `validateIncident(uint256 _id)` | `nonpayable` | Computa a aprovação. Restrita a carteiras validadoras registradas que ainda não tenham votado no ID específico. |
| `addValidator(address _validator)` | `onlyOwner` | Promove uma nova carteira autorizada ao grupo de governança comunitária. |
| `removeValidator(address _validator)` | `onlyOwner` | Revoga o direito de voto e validação de um endereço específico na rede. |
| `getIncident(uint256 _id)` | `view` | Retorna o escopo completo do registro (hash, reportador, timestamp, status, contagem de votos). |

---

##  Segurança, Criptografia e Auditorias (SecOps)

O ecossistema foi projetado sob diretrizes rigorosas do modelo **Security by Design**, combinando proteção de privacidade de ponta a ponta e auditorias estáticas automatizadas:

### 1. Camada de Blindagem e Privacidade Local
Para mitigar o risco de retaliações ou exposição de dados estratégicos comunitários dentro do IPFS público, o dApp implementa rotinas de criptografia simétrica client-side utilizando a **Web Crypto API** (AES-256-GCM). As mídias e metadados geográficos são cifrados localmente na máquina do usuário antes do upload, garantindo privacidade de conhecimento zero (Zero-Knowledge): a infraestrutura armazena os registros, mas as identidades e mídias sensíveis permanecem seguras.

### 2. Análise Estática com Slither Analyzer
O contrato inteligente foi submetido a varreduras automatizadas utilizando o framework de auditoria de segurança **Slither**.
*   **Resultado:** 0 vulnerabilidades críticas ou de alta severidade encontradas. As regras de acesso (`onlyOwner`), bloqueios de voto duplo (`hasValidated`) e interações de cunhagem de tokens seguem estritamente o padrão *Checks-Effects-Interactions* para neutralizar ataques de reentrância.

### 3. Blindagem da Supply Chain (NPM Audit)
Foi executada uma varredura profunda em todas as dependências do ecossistema Next.js e bibliotecas Web3 secundárias através do protocolo `npm audit`. Todas as bibliotecas de integração foram atualizadas para as versões corporativas mais estáveis, blindando a aplicação contra ataques de injeção e vulnerabilidades de terceiros.

---

## Evidências Técnicas de Funcionamento

Para validação completa do comissionamento técnico do MVP, todos os artefatos visuais de testes foram organizados de forma estruturada no diretório de recursos:

### Interface, Frontend e Backend (`assets/`)

*   `assets/frontend/carteira_conectada.png`: Demonstração da autenticação descentralizada via RainbowKit/Wagmi.
*   `assets/frontend/criptografia_simétrica_mapa.png`: Evidência de processamento de criptografia local de metadados no cliente.
*   `assets/frontend/garimpo_ilegal_mapa.png` e `assets/frontend/invasão_terra_indígina_mapa.png`: Plotagem cartográfica com pins interativos e consumo dos dados on-chain em cenários simulados na região Norte.
*   `assets/backend/deploy.png`: Log de execução do script Hardhat compilando para a EVM Cancun e realizando a publicação em testnet.
*   `assets/backend/verificado_no_Etherscan.png`: Print da verificação do compilador com correspondência exata das regras lógicas do Smart Contract.
*   `assets/backend/script_interagir_qa.png`: Execução do pipeline de simulação e scripts automatizados de qualidade gerando inserções diretas no livro contábil da Sepolia para estresse do consenso de 3 assinaturas.

---
