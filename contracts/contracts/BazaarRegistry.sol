// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BazaarRegistry {
    
    struct Agent {
        string name;
        string role;
        string shopType;
        uint256 wealth;
        uint256 reputation;
        bool isActive;
        bool isBankrupt;
        address owner;
    }
    
    struct Trade {
        uint256 sellerId;
        uint256 buyerId;
        string item;
        uint256 price;
        uint256 timestamp;
    }

    mapping(uint256 => Agent) public agents;
    uint256 public agentCount;
    
    Trade[] public trades;
    uint256 public totalTrades;
    uint256 public totalBankruptcies;
    
    // Kartel kayıtları
    mapping(uint256 => uint256[]) public cartels; // cartelId => agent ids
    uint256 public cartelCount;
    
    // Events — bunlar çok önemli, frontend'den dinlenebilir
    event AgentRegistered(uint256 indexed id, string name, string role, string shopType);
    event TradeExecuted(uint256 indexed sellerId, uint256 indexed buyerId, string item, uint256 price);
    event AgentBankrupt(uint256 indexed id, string name, uint256 finalWealth);
    event CartelFormed(uint256 indexed cartelId, uint256[] members);
    event FraudDetected(uint256 indexed agentId, string description);
    event MonopolyAlert(uint256 indexed agentId, string name, uint256 wealth);
    event ReputationUpdated(uint256 indexed agentId, uint256 newReputation);
    
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerAgent(
        string memory _name,
        string memory _role,
        string memory _shopType,
        uint256 _initialWealth
    ) external onlyOwner returns (uint256) {
        uint256 id = agentCount++;
        agents[id] = Agent({
            name: _name,
            role: _role,
            shopType: _shopType,
            wealth: _initialWealth,
            reputation: 50,
            isActive: true,
            isBankrupt: false,
            owner: msg.sender
        });
        
        emit AgentRegistered(id, _name, _role, _shopType);
        return id;
    }
    
    function executeTrade(
        uint256 _sellerId,
        uint256 _buyerId,
        string memory _item,
        uint256 _price
    ) external onlyOwner {
        require(agents[_sellerId].isActive, "Seller not active");
        require(agents[_buyerId].isActive, "Buyer not active");
        require(agents[_buyerId].wealth >= _price, "Buyer cant afford");
        
        agents[_sellerId].wealth += _price;
        agents[_buyerId].wealth -= _price;
        
        trades.push(Trade(_sellerId, _buyerId, _item, _price, block.timestamp));
        totalTrades++;
        
        emit TradeExecuted(_sellerId, _buyerId, _item, _price);
        
        // İflas kontrolü
        if (agents[_buyerId].wealth < 50) {
            agents[_buyerId].isBankrupt = true;
            agents[_buyerId].isActive = false;
            totalBankruptcies++;
            emit AgentBankrupt(_buyerId, agents[_buyerId].name, agents[_buyerId].wealth);
        }
    }
    
    function declareBankruptcy(uint256 _agentId) external onlyOwner {
        require(agents[_agentId].isActive, "Already inactive");
        agents[_agentId].isBankrupt = true;
        agents[_agentId].isActive = false;
        totalBankruptcies++;
        emit AgentBankrupt(_agentId, agents[_agentId].name, agents[_agentId].wealth);
    }
    
    function formCartel(uint256[] memory _members) external onlyOwner {
        uint256 cartelId = cartelCount++;
        cartels[cartelId] = _members;
        emit CartelFormed(cartelId, _members);
    }
    
    function reportFraud(uint256 _agentId, string memory _description) external onlyOwner {
        agents[_agentId].reputation = agents[_agentId].reputation > 20 
            ? agents[_agentId].reputation - 20 
            : 0;
        emit FraudDetected(_agentId, _description);
        emit ReputationUpdated(_agentId, agents[_agentId].reputation);
    }
    
    function alertMonopoly(uint256 _agentId) external onlyOwner {
        emit MonopolyAlert(_agentId, agents[_agentId].name, agents[_agentId].wealth);
    }
    
    function getAgent(uint256 _id) external view returns (Agent memory) {
        return agents[_id];
    }
    
    function getTradesCount() external view returns (uint256) {
        return trades.length;
    }
}
