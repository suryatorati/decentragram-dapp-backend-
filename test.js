const Decentragram = artifacts.require("Decentragram");

contract ("Decentragram", ([deployer, author, tipper]) => {
  let decentragram;

  before(async () => {
    decentragram = await Decentragram.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await decentragram.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await decentragram.name();
      assert.equal(name, "Decentragram");
    });
  });

  describe("images", async () => {
    let result, imageCount;

    before(async () => {
      result = await decentragram.uploadImage("test-image-hash", "Test Image", { from: author });
      imageCount = await decentragram.imageCount();
    });

    it("creates images", async () => {
      // SUCCESS
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hash, "test-image-hash", "hash is correct");
      assert.equal(event.description, "Test Image", "description is correct");
      assert.equal(event.tipAmount, 0, "tip amount is correct");
      assert.equal(event.author, author, "author is correct");

      // FAILURE: Image must have hash
      await decentragram.uploadImage("", "Test Image", { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await decentragram.uploadImage("test-image-hash", "", { from: author }).should.be.rejected;
    });

    it("lists images", async () => {
      const image = await decentragram.images(imageCount);
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(image.hash, "test-image-hash", "hash is correct");
      assert.equal(image.description, "Test Image", "description is correct");
      assert.equal(image.tipAmount, 0, "tip amount is correct");
      assert.equal(image.author, author, "author is correct");
    });

    it("allows users to tip images", async () => {
      // Track the author balance before purchase
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei("1", "Ether") });

      // SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hash, "test-image-hash", "hash is correct");
      assert.equal(event.description, "Test Image", "description is correct");
      assert.equal(event.tipAmount, web3.utils.toWei("1", "Ether"), "tip amount is correct");
      assert.equal(event.author, author, "author is correct");

    });
  });
});