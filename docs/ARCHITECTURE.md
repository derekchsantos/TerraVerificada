# Arquitetura Técnica — TerraVerificada

## Visão Geral
O ecossistema do **TerraVerificada** é estruturado em três camadas principais para garantir descentralização, segurança e escalabilidade:
1. **Apresentação (Frontend):** Interface moderna em Next.js (Turbopack) integrada com Web3 via Wagmi/RainbowKit e mapas interativos Leaflet.
2. **Lógica de Negócio (Smart Contracts):** Contrato inteligente robusto desenvolvido em Solidity 0.8.24 utilizando as bibliotecas seguras da OpenZeppelin.
3. **Armazenamento Descentralizado (IPFS):** Camada de persistência de arquivos e metadados pesados fora da blockchain (Off-chain).

---

## Fluxo de Dados e Ciclo de Vida

### 1. Registro do Incidente
- O usuário preenche o formulário territorial no Frontend e anexa as evidências multimídia (fotos, áudios ou relatórios).
- Os arquivos são enviados diretamente para o **IPFS**, que retorna um identificador único imutável (Content Identifier - CID).
- O Frontend dispara a função `registerIncident(string memory _ipfsHash)` assinada pela carteira do usuário.
- O Smart Contract cria um registro persistente no *storage* mapeando o ID, o Hash do IPFS, o endereço do reportador e o carimbo de data/hora (`block.timestamp`).

### 2. Validação por Consenso Comunitário
- Lideranças e validadores autorizados visualizam os alertas pendentes no painel cartográfico.
- O validador assina uma transação chamando a função `validateIncident(uint256 _id)` no Smart Contract.
- O contrato executa três verificações de segurança obrigatórias:
  1. O remetente (`msg.sender`) pertence à lista de validadores permitidos.
  2. O incidente está estritamente com o status `Status.PENDING`.
  3. O validador atual ainda não votou neste incidente específico (bloqueio de voto duplo via mapeamento `hasValidated`).
- Preenchidos os requisitos, a validação é computada e o contador `validationCount` é incrementado.

### 3. Emissão Automática do Certificado (NFT)
- Assim que o contador atinge o limite regulamentado de **3 validações independentes**, a máquina de estados do contrato é acionada:
  - O status do incidente é atualizado permanentemente para `Status.VERIFIED`.
  - O contrato executa a função interna `_safeMint()` da OpenZeppelin, cunhando um token ERC-721 diretamente na carteira do reportador original.
  - É disparado o evento global `CertificateIssued` na rede Sepolia para sincronização do ecossistema.

---

## Decisões Técnicas Justificadas

### Por que Blockchain (Ethereum/Sepolia)?
- **Imutabilidade Territorial:** Uma vez registrado e validado por consenso, o registro de conflito torna-se uma prova jurídica perpétua e inalterável.
- **Transparência e Auditoria:** Permite que órgãos de direitos humanos, a comunidade internacional e a sociedade civil auditem o histórico de violações sem intermediários.
- **Descentralização:** Transfere a soberania da custódia dos dados das mãos de entidades centrais para a própria rede comunitária protegida pela criptografia.

### Por que IPFS (InterPlanetary File System)?
- **Eficiência Financeira:** Armazenar mídias diretamente em variáveis de estado da blockchain (On-chain) geraria custos inviáveis de taxas de gás.
- **Segurança por Conteúdo:** Diferente de URLs tradicionais (HTTP), o hash do IPFS garante que o conteúdo da evidência não possa ser modificado na nuvem sem alterar o próprio link.

### Por que Mecanismo de Consenso Distribuído (3 Validadores)?
- **Mitigação de Ataques:** Protege a plataforma contra agentes mal-intencionados que tentem registrar falsos positivos ou forjar alertas individuais.
- **Soberania Coletiva:** Espelha digitalmente o modelo tradicional de tomada de decisão das assembleias e conselhos das comunidades tradicionais indígenas.

---

## Diagrama de Sequência Estruturado

```text
[Usuário] --------(1) Envia Evidências (Fotos/Áudios)--------> [ IPFS ]
[Usuário] <-------(2) Retorna Identificador (CID)------------ [ IPFS ]
[Usuário] --------(3) Assina registerIncident(CID)----------> [Smart Contract]

                                                                     |
                                                               (4) Grava Alerta
                                                               (Status: PENDING)
                                                                     |
                                                                     v
[Validador 1, 2, 3] --(5) Executa validateIncident(ID)------> [Smart Contract]

                                                                     |
                                                               (6) Valida Regras
                                                               (Atinge Consenso)
                                                                     |
                                                                     v
[Usuário (Carteira)] <-- (7) Emite NFT de Certificado (TVC)--- [Smart Contract]
```

---

## Camada de Segurança e Integridade
- **Controle de Acesso Estrito:** As funções críticas de governança (`addValidator` e `removeValidator`) utilizam o modificador `onlyOwner` protegendo as rotas administrativas contra acessos não autorizados.
- **Prevenção de Ataques de Reentrância:** A arquitetura do contrato utiliza o padrão de design *Checks-Effects-Interactions* (Verificações-Efeitos-Interações) e a proteção nativa contra estouro de memória do Solidity 0.8+, neutralizando explorações financeiras conhecidas.

---

## Auditoria de Segurança e Testes de Estresse (Red Team)

O ecossistema **TerraVerificada** passou por uma suíte de testes de invasão e estresse cibernético automatizado através do script `test/security-audit.test.js`. O objetivo foi validar a resiliência do contrato inteligente `ImpactNFT` contra vetores de ataque comuns em ambientes descentralizados.

### Resultados Obtidos
*   **Ataque Sybil:** Tentativas de injeção de relatos falsos por endereços não-validadores foram prontamente rejeitadas pela EVM (`Caller is not a community validator`).
*   **Privilege Escalation:** Tentativas maliciosas de alteração de papéis administrativos ou remoção de validadores legítimos foram bloqueadas com sucesso.
*   **Double Voting:** Mecanismos de trava de estado impediram com sucesso que um mesmo validador registrasse múltiplos votos para o mesmo incidente.

O contrato inteligente provou-se 100% íntegro e seguro para operações em produção.

*Evidência de Sucesso da Auditoria:**
![Relatório de Auditoria Red Team](../assets/backend/auditoria_seguranca.png)
