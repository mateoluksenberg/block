const ApartmentContract = artifacts.require("ApartmentContract");

contract("ApartmentContract", (accounts) => {
  let contractInstance;
  const [owner, buyer1, buyer2] = accounts;

  before(async () => {
    contractInstance = await ApartmentContract.deployed();
  });

  it("should deploy successfully", async () => {
    const address = await contractInstance.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, "0x0");
    assert.notEqual(address, "");
  });

  it("should create an apartment by the owner", async () => {
    const result = await contractInstance.createApartment("Apartment 1", "Location 1", web3.utils.toWei("1", "ether"), { from: owner });
    const apartment = await contractInstance.getApartment(1);
    
    assert.equal(apartment.id.toNumber(), 1);
    assert.equal(apartment.name, "Apartment 1");
    assert.equal(apartment.location, "Location 1");
    assert.equal(apartment.price.toString(), web3.utils.toWei("1", "ether"));
    assert.equal(apartment.isBought, false);
    assert.equal(apartment.boughtAt.toNumber(), 0);

    // Check the event
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.name, "Apartment 1");
    assert.equal(event.location, "Location 1");
    assert.equal(event.price.toString(), web3.utils.toWei("1", "ether"));
    assert.equal(event.isBought, false);
    assert.equal(event.boughtAt.toNumber(), 0);
  });

  it("should fail if a non-owner tries to create an apartment", async () => {
    try {
      await contractInstance.createApartment("Apartment 2", "Location 2", web3.utils.toWei("2", "ether"), { from: buyer1 });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("Only owner can perform this action"), "Expected revert error not received");
    }
  });

  it("should allow a user to buy an apartment", async () => {
    await contractInstance.createApartment("Apartment 3", "Location 3", web3.utils.toWei("1", "ether"), { from: owner });
    const result = await contractInstance.buyApartment(2, { from: buyer1, value: web3.utils.toWei("1", "ether") });
    
    const apartment = await contractInstance.getApartment(2);
    assert.equal(apartment.isBought, true);

    const buyer = await contractInstance.getBuyer(buyer1);
    assert.equal(buyer.boughtApartmentId.toNumber(), 2);

    // Check the event
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 2);
    assert.equal(event.name, "Apartment 3");
    assert.equal(event.location, "Location 3");
    assert.equal(event.price.toString(), web3.utils.toWei("1", "ether"));
    assert.equal(event.isBought, true);
    assert.equal(event.boughtAt.toNumber(), (await web3.eth.getBlock('latest')).timestamp);
  });

  it("should fail if an apartment is already bought", async () => {
    try {
      await contractInstance.buyApartment(2, { from: buyer2, value: web3.utils.toWei("1", "ether") });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("Apartment already bought"), "Expected revert error not received");
    }
  });

  it("should fail if insufficient funds are sent", async () => {
    try {
      await contractInstance.buyApartment(2, { from: buyer2, value: web3.utils.toWei("0.5", "ether") });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("Insufficient funds to buy the apartment"), "Expected revert error not received");
    }
  });
});
