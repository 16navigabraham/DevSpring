// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./crowdfund.sol"; // Your current contract

interface ENS {
    function owner(bytes32 node) external view returns (address);
}

contract CrowdfundFactory {
    ENS public ens;
    address public ensRegistry = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e; // Ethereum Mainnet ENS registry

    address[] public campaigns;
    mapping(address => bool) public isVerifiedDev;

    constructor() {
        ens = ENS(ensRegistry);
    }

    function namehash(string memory name) public pure returns (bytes32) {
        bytes32 node;
        assembly {
            node := 0
        }
        // Simple `.eth` only, extend if needed
        node = keccak256(abi.encodePacked(node, keccak256(abi.encodePacked("eth"))));
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
