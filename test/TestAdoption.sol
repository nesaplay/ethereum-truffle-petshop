pragma solidity ^0.4.17;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/Adoption.sol';

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(4);
        uint expected = 4;

        Assert.equal(returnedId, expected, "Adoption of pet ID 4 should be recorded.");
    }

    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(4);
        address expected = this;

        Assert.equal(adopter, expected, "Owner of pet ID 4 should be recorded.");
    }

    function testGetAdopterAddressByPetInArray() public {
        address[16] memory adopters = adoption.getAdopters();
        address expected = this;

        Assert.equal(adopters[4], expected, "Owner of pet ID 4 should be recorded.");
    }
}