// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./crowdfund.sol";

interface ENS {
    function owner(bytes32 node) external view returns (address);
}

contract CrowdfundFactory {
    ENS public ens;
    address[] public campaigns;
    mapping(address => bool) public isVerifiedDev;

    constructor(address _ensRegistry) {
        ens = ENS(_ensRegistry); // ENS registry for Base or Ethereum
    }

    function namehash(string memory name) public pure returns (bytes32) {
        // Only supports .eth domains
        bytes32 node = keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("eth"))));
        node = keccak256(abi.encodePacked(node, keccak256(abi.encodePacked(name))));
        return node;
    }

    function verifyDev(string calldata ensName) external {
        bytes32 node = namehash(ensName);
        require(ens.owner(node) == msg.sender, "Not ENS owner");
        isVerifiedDev[msg.sender] = true;
    }

    function createCrowdfund(uint256 goal, uint256 duration) external returns (address) {
        require(isVerifiedDev[msg.sender], "Not a verified developer");
        crowdfunds newCampaign = new crowdfunds(goal, duration);
        campaigns.push(address(newCampaign));
        return address(newCampaign);
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}

