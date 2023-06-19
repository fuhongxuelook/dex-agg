const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner] = await ethers.getSigners();

    const ownerBalance = await owner.getBalance();

    console.log(ownerBalance);
  });
});
