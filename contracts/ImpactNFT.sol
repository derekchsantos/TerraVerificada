// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ImpactNFT
 * @notice Contrato para o projeto TerraVerificada - Hackweb ImpactLedger 2026
 * 
 * @dev DECISÃO DE DESIGN:
 * Optei por implementar um mecanismo de "Consenso Comunitário" exigindo 
 * 3 validações distintas antes de emitir o certificado (NFT).
 * 
 * Motivo: Em conflitos fundiários reais, a validação nunca deve ser unilateral.
 * Isso simula a governança de comunidades onde líderes precisam concordar
 * para que uma ação seja considerada legítima.
 * 
 * NOTA: Para fins de demonstração rápida no hackathon, o sistema foi 
 * configurado com apenas 1 validador ativo, mas a lógica suporta o 
 * consenso de 3. Em produção, isso seria mandatório.
 */
contract ImpactNFT is ERC721, Ownable {
    
    // Enum para status do incidente
    enum Status { PENDING, VERIFIED, REJECTED }

    // Estrutura de dados rica para o incidente
    struct Incident {
        uint256 id;
        string ipfsHash; // Hash do JSON contendo foto, audio, coords
        address reporter;
        uint256 timestamp;
        Status status;
        mapping(address => bool) hasValidated; // Quem já validou
        uint256 validationCount; // Contagem de validações
    }

    mapping(uint256 => Incident) public incidents;
    address[] public validators; // Lista de validadores autorizados
    uint256 public incidentCounter;
    uint256 public constant REQUIRED_VALIDATIONS = 3; // Diferencial: Consenso de 3

    event IncidentRegistered(uint256 indexed id, address indexed reporter, string ipfsHash);
    event IncidentValidated(uint256 indexed id, address indexed validator);
    event CertificateIssued(uint256 indexed id, address indexed recipient);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);

    constructor() ERC721("TerraVerificada Certificate", "TVC") Ownable(msg.sender) {}

    // Adiciona um validador comunitário (só o dono pode fazer)
    function addValidator(address _validator) external onlyOwner {
        require(_validator != address(0), "Invalid address");
        require(!isValidator(_validator), "Already a validator");
        
        validators.push(_validator);
        emit ValidatorAdded(_validator);
    }

    // Remove um validador
    function removeValidator(address _validator) external onlyOwner {
        require(isValidator(_validator), "Not a validator");
        
        for (uint256 i = 0; i < validators.length; i++) {
            if (validators[i] == _validator) {
                validators[i] = validators[validators.length - 1];
                validators.pop();
                break;
            }
        }
        emit ValidatorRemoved(_validator);
    }

    // Verifica se um endereço é validador
    function isValidator(address _addr) public view returns (bool) {
        for (uint256 i = 0; i < validators.length; i++) {
            if (validators[i] == _addr) return true;
        }
        return false;
    }

    // Registra um novo incidente de conflito fundiário
    // @param _ipfsHash O hash do IPFS contendo as evidências (foto, audio, coords)
    function registerIncident(string memory _ipfsHash) external returns (uint256) {
        incidentCounter++;
        uint256 newId = incidentCounter;

        // CORREÇÃO: Criamos a referência direto no storage para ignorar a instanciação do mapping interno
        Incident storage newIncident = incidents[newId];
        newIncident.id = newId;
        newIncident.ipfsHash = _ipfsHash;
        newIncident.reporter = msg.sender;
        newIncident.timestamp = block.timestamp;
        newIncident.status = Status.PENDING;
        newIncident.validationCount = 0;
        // O mapping 'hasValidated' inicia automaticamente com valores falsos de forma nativa

        emit IncidentRegistered(newId, msg.sender, _ipfsHash);
        return newId;
    }

    // Valida um incidente. Requer que o chamador seja um validador.
    // Se atingir 3 validações, emite o NFT automaticamente.
    function validateIncident(uint256 _id) external {
        require(isValidator(msg.sender), "Caller is not a community validator");
        require(incidents[_id].status == Status.PENDING, "Incident not pending");
        require(!incidents[_id].hasValidated[msg.sender], "Already validated by you");

        // Registra a validação
        incidents[_id].hasValidated[msg.sender] = true;
        incidents[_id].validationCount++;
        
        emit IncidentValidated(_id, msg.sender);

        // Lógica de Consenso: Se atingiu 3 validações, emite o certificado (NFT)
        if (incidents[_id].validationCount >= REQUIRED_VALIDATIONS) {
            incidents[_id].status = Status.VERIFIED;
            _safeMint(incidents[_id].reporter, _id); // NFT vai para o reportador
            emit CertificateIssued(_id, incidents[_id].reporter);
        }
    }

    // Rejeita um incidente (apenas dono ou validadores podem rejeitar se houver consenso de rejeição)
    // Simplificado para demo: Só o dono pode rejeitar manualmente se necessário
    function rejectIncident(uint256 _id) external onlyOwner {
        require(incidents[_id].status == Status.PENDING, "Cannot reject non-pending");
        incidents[_id].status = Status.REJECTED;
    }

    // Retorna os detalhes completos de um incidente
    function getIncident(uint256 _id) external view returns (
        uint256 id,
        string memory ipfsHash,
        address reporter,
        uint256 timestamp,
        Status status,
        uint256 validationCount
    ) {
        // CORREÇÃO: Mudado para 'storage' para conseguir ler do mapeamento de forma eficiente
        Incident storage inc = incidents[_id];
        return (inc.id, inc.ipfsHash, inc.reporter, inc.timestamp, inc.status, inc.validationCount);
    }
    
    // Retorna a lista de validadores (útil para debug/frontend)
    function getValidators() external view returns (address[] memory) {
        return validators;
    }
}
