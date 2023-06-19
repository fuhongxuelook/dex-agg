const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("update fee rate", function () {
  it("Should return the new FeeTo once it's changed", async function () {

    let fee_address = "0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804";
    const perform = await ethers.getContractFactory("Performer");
    const performer = await perform.deploy(fee_address)

    let baseRate = 6;
    let newRate = 7;
    console.log("performer address is:", performer.address)

    let feeRate = await performer.feeRate();

    expect(feeRate).to.equal(baseRate); 

    let update_feerate_tx = await performer.setFeeRate(newRate);
    await update_feerate_tx.wait();

    let new_feerate = await performer.feeRate();

    expect(new_feerate).to.equal(newRate);

  });
});
