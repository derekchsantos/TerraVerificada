export const IMPACT_NFT_ABI = [
  "function incidentCounter() view returns (uint256)",
  "function REQUIRED_VALIDATIONS() view returns (uint256)",
  "function registerIncident(string _ipfsHash) returns (uint256)",
  "function validateIncident(uint256 _id)",
  "function getIncident(uint256 _id) view returns (uint256 id, string ipfsHash, address reporter, uint256 timestamp, uint8 status, uint256 validationCount)",
  "function isValidator(address _addr) view returns (bool)",
  "event IncidentRegistered(uint256 indexed id, address indexed reporter, string ipfsHash)",
  "event IncidentValidated(uint256 indexed id, address indexed validator)"
] as const;

export const CONTRACT_ADDRESS = "0xA821477f669D74093Fc47eCd3095b9120Bc30a7f";
