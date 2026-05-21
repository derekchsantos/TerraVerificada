// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * title ImpactNFT
 * Contrato único para o TerraVerificada.
 * Gerencia registros de conflitos fundiários com validação por consenso comunitário (3 validadores).
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

    /**
     * Adiciona um validador comunitário (só o dono pode fazer)
     */
    function addValidator(address _validator) external onlyOwner {
        require(_validator != address(0), "Invalid address");
        require(!isValidator(_validator), "Already a validator");
        
        validators.push(_validator);
        emit ValidatorAdded(_validator);
    }

    /**
     * Remove um validador
     */
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

    /**
     * Verifica se um endereço é validador
     */
    function isValidator(address _addr) public view returns (bool) {
        for (uint256 i = 0; i < validators.length; i++) {
            if (validators[i] == _addr) return true;
        }
        return false;
    }

    /**
     * Registra um novo incidente de conflito fundiário
     * @param _ipfsHash O hash do IPFS contendo as evidências (foto, audio, coords)
     */
    function registerIncident(string memory _ipfsHash) external returns (uint256) {
        incidentCounter++;
        uint256 newId = incidentCounter;

        incidents[newId] = Incident({
            id: newId,
            ipfsHash: _ipfsHash,
            reporter: msg.sender,
            timestamp: block.timestamp,
            status: Status.PENDING,
            validationCount: 0
        });

        emit IncidentRegistered(newId, msg.sender, _ipfsHash);
        return newId;
    }

    /**
     * Valida um incidente. Requer que o chamador seja um validador.
     * Se atingir 3 validações, emite o NFT automaticamente.
     */
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

    /**
     * Rejeita um incidente (apenas dono ou validadores podem rejeitar se houver consenso de rejeição)
     * Simplificado para demo: Só o dono pode rejeitar manualmente se necessário
     */
    function rejectIncident(uint256 _id) external onlyOwner {
        require(incidents[_id].status == Status.PENDING, "Cannot reject non-pending");
        incidents[_id].status = Status.REJECTED;
    }

    /**
     * Retorna os detalhes completos de um incidente
     */
    function getIncident(uint256 _id) external view returns (
        uint256 id,
        string memory ipfsHash,
        address reporter,
        uint256 timestamp,
        Status status,
        uint256 validationCount
    ) {
        Incident memory inc = incidents[_id];
        return (inc.id, inc.ipfsHash, inc.reporter, inc.timestamp, inc.status, inc.validationCount);
    }
    
    /**
     * Retorna a lista de validadores (útil para debug/frontend)
     */
    function getValidators() external view returns (address[] memory) {
        return validators;
    }
}
