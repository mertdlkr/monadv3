// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GuildDAO {
    
    enum ProposalCategory { TAX, REGULATION, PUNISHMENT, TRADE_RULE, EMERGENCY }
    enum ProposalStatus { ACTIVE, PASSED, REJECTED, EXECUTED }
    
    struct Proposal {
        string title;
        string description;
        ProposalCategory category;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        ProposalStatus status;
        bool executed;
    }
    
    Proposal[] public proposals;
    uint256 public proposalCount;
    
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Guild üyeleri
    mapping(address => bool) public members;
    uint256 public memberCount;
    
    address public guildMaster;
    
    // Events
    event ProposalCreated(uint256 indexed id, string title, ProposalCategory category, address proposer);
    event VoteCast(uint256 indexed proposalId, address voter, bool support);
    event ProposalExecuted(uint256 indexed id, string title);
    event MemberAdded(address member);
    event GuildDecree(string decree);
    
    modifier onlyGuildMaster() {
        require(msg.sender == guildMaster, "Not guild master");
        _;
    }
    
    modifier onlyMember() {
        require(members[msg.sender] || msg.sender == guildMaster, "Not a member");
        _;
    }
    
    constructor() {
        guildMaster = msg.sender;
        members[msg.sender] = true;
        memberCount = 1;
    }
    
    function addMember(address _member) external onlyGuildMaster {
        require(!members[_member], "Already member");
        members[_member] = true;
        memberCount++;
        emit MemberAdded(_member);
    }
    
    function propose(
        string memory _title,
        string memory _description,
        ProposalCategory _category,
        uint256 _votingDays
    ) external onlyMember returns (uint256) {
        uint256 id = proposalCount++;
        proposals.push(Proposal({
            title: _title,
            description: _description,
            category: _category,
            proposer: msg.sender,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + (_votingDays * 1 days),
            status: ProposalStatus.ACTIVE,
            executed: false
        }));
        
        emit ProposalCreated(id, _title, _category, msg.sender);
        return id;
    }
    
    function vote(uint256 _proposalId, bool _support) external onlyMember {
        Proposal storage p = proposals[_proposalId];
        require(p.status == ProposalStatus.ACTIVE, "Not active");
        require(block.timestamp < p.deadline, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        hasVoted[_proposalId][msg.sender] = true;
        
        if (_support) {
            p.votesFor++;
        } else {
            p.votesAgainst++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support);
    }
    
    function executeProposal(uint256 _proposalId) external onlyGuildMaster {
        Proposal storage p = proposals[_proposalId];
        require(!p.executed, "Already executed");
        require(p.votesFor > p.votesAgainst, "Not enough votes");
        
        p.executed = true;
        p.status = ProposalStatus.EXECUTED;
        
        emit ProposalExecuted(_proposalId, p.title);
    }
    
    function issueDecree(string memory _decree) external onlyGuildMaster {
        emit GuildDecree(_decree);
    }
    
    function getProposal(uint256 _id) external view returns (Proposal memory) {
        return proposals[_id];
    }
}
