const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PagalayPayments", function () {
  let PagalayPayments, pagalayPayments;
  let owner, vendor, customer, feeCollector;
  
  beforeEach(async function () {
    [owner, vendor, customer, feeCollector] = await ethers.getSigners();
    
    PagalayPayments = await ethers.getContractFactory("PagalayPayments");
    pagalayPayments = await PagalayPayments.deploy(feeCollector.address);
    await pagalayPayments.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right fee collector", async function () {
      expect(await pagalayPayments.feeCollector()).to.equal(feeCollector.address);
    });

    it("Should set the right owner", async function () {
      expect(await pagalayPayments.owner()).to.equal(owner.address);
    });

    it("Should have correct initial fee percentage", async function () {
      expect(await pagalayPayments.feePercentage()).to.equal(150); // 1.5%
    });
  });

  describe("Vendor Registration", function () {
    it("Should register a vendor successfully", async function () {
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
      
      const vendorInfo = await pagalayPayments.getVendor(vendor.address);
      expect(vendorInfo.businessName).to.equal("Tienda María");
      expect(vendorInfo.location).to.equal("La Paz, Bolivia");
      expect(vendorInfo.isActive).to.be.true;
    });

    it("Should emit VendorRegistered event", async function () {
      await expect(pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia"))
        .to.emit(pagalayPayments, "VendorRegistered")
        .withArgs(vendor.address, "Tienda María", await getBlockTimestamp());
    });

    it("Should not allow empty business name", async function () {
      await expect(
        pagalayPayments.connect(vendor).registerVendor("", "La Paz, Bolivia")
      ).to.be.revertedWith("Business name required");
    });

    it("Should not allow duplicate registration", async function () {
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
      
      await expect(
        pagalayPayments.connect(vendor).registerVendor("Tienda Pedro", "Cochabamba, Bolivia")
      ).to.be.revertedWith("Vendor already registered");
    });
  });

  describe("Payments", function () {
    beforeEach(async function () {
      // Registrar vendedor antes de cada test
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
    });

    it("Should make a payment successfully", async function () {
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("transaction_001");
      
      await expect(
        pagalayPayments.connect(customer).makePayment(
          vendor.address,
          transactionId,
          "Compra de productos",
          { value: paymentAmount }
        )
      ).to.emit(pagalayPayments, "PaymentMade")
        .withArgs(customer.address, vendor.address, paymentAmount, transactionId, await getBlockTimestamp());
    });

    it("Should calculate fees correctly", async function () {
      const paymentAmount = ethers.utils.parseEther("1.0");
      const expectedFee = paymentAmount.mul(150).div(10000); // 1.5%
      const transactionId = ethers.utils.id("transaction_002");

      const feeCollectorBalanceBefore = await feeCollector.getBalance();

      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        transactionId,
        "Compra de productos",
        { value: paymentAmount }
      );

      const feeCollectorBalanceAfter = await feeCollector.getBalance();
      expect(feeCollectorBalanceAfter.sub(feeCollectorBalanceBefore)).to.equal(expectedFee);
    });

    it("Should store payment information correctly", async function () {
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("transaction_003");
      const description = "Compra de productos";

      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        transactionId,
        description,
        { value: paymentAmount }
      );

      const payment = await pagalayPayments.getPayment(transactionId);
      expect(payment.from).to.equal(customer.address);
      expect(payment.to).to.equal(vendor.address);
      expect(payment.amount).to.equal(paymentAmount);
      expect(payment.confirmed).to.be.false;
      expect(payment.refunded).to.be.false;
      expect(payment.description).to.equal(description);
    });

    it("Should not allow payments to inactive vendors", async function () {
      // Desactivar vendedor
      await pagalayPayments.deactivateVendor(vendor.address);
      
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("transaction_004");

      await expect(
        pagalayPayments.connect(customer).makePayment(
          vendor.address,
          transactionId,
          "Compra de productos",
          { value: paymentAmount }
        )
      ).to.be.revertedWith("Vendor is not active");
    });

    it("Should not allow zero amount payments", async function () {
      const transactionId = ethers.utils.id("transaction_005");

      await expect(
        pagalayPayments.connect(customer).makePayment(
          vendor.address,
          transactionId,
          "Compra de productos",
          { value: 0 }
        )
      ).to.be.revertedWith("Payment amount must be greater than 0");
    });

    it("Should not allow duplicate transaction IDs", async function () {
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("transaction_006");

      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        transactionId,
        "Primera compra",
        { value: paymentAmount }
      );

      await expect(
        pagalayPayments.connect(customer).makePayment(
          vendor.address,
          transactionId,
          "Segunda compra",
          { value: paymentAmount }
        )
      ).to.be.revertedWith("Transaction ID already exists");
    });
  });

  describe("Payment Confirmation", function () {
    let transactionId, paymentAmount;

    beforeEach(async function () {
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
      
      paymentAmount = ethers.utils.parseEther("1.0");
      transactionId = ethers.utils.id("transaction_confirm");
      
      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        transactionId,
        "Compra de productos",
        { value: paymentAmount }
      );
    });

    it("Should allow vendor to confirm payment", async function () {
      await expect(
        pagalayPayments.connect(vendor).confirmPayment(transactionId)
      ).to.emit(pagalayPayments, "PaymentConfirmed")
        .withArgs(transactionId, vendor.address, await getBlockTimestamp());

      const payment = await pagalayPayments.getPayment(transactionId);
      expect(payment.confirmed).to.be.true;
    });

    it("Should update vendor statistics after confirmation", async function () {
      await pagalayPayments.connect(vendor).confirmPayment(transactionId);

      const vendorInfo = await pagalayPayments.getVendor(vendor.address);
      expect(vendorInfo.totalReceived).to.equal(paymentAmount);
      expect(vendorInfo.transactionCount).to.equal(1);
    });

    it("Should not allow non-vendor to confirm payment", async function () {
      await expect(
        pagalayPayments.connect(customer).confirmPayment(transactionId)
      ).to.be.revertedWith("Vendor not registered or inactive");
    });

    it("Should not allow confirming twice", async function () {
      await pagalayPayments.connect(vendor).confirmPayment(transactionId);
      
      await expect(
        pagalayPayments.connect(vendor).confirmPayment(transactionId)
      ).to.be.revertedWith("Payment already confirmed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update fee percentage", async function () {
      const newFee = 200; // 2%
      await pagalayPayments.updateFeePercentage(newFee);
      expect(await pagalayPayments.feePercentage()).to.equal(newFee);
    });

    it("Should not allow setting fee too high", async function () {
      const tooHighFee = 600; // 6% (max is 5%)
      await expect(
        pagalayPayments.updateFeePercentage(tooHighFee)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to update fee collector", async function () {
      const [, , , newCollector] = await ethers.getSigners();
      await pagalayPayments.updateFeeCollector(newCollector.address);
      expect(await pagalayPayments.feeCollector()).to.equal(newCollector.address);
    });

    it("Should allow owner to deactivate vendor", async function () {
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
      await pagalayPayments.deactivateVendor(vendor.address);

      const vendorInfo = await pagalayPayments.getVendor(vendor.address);
      expect(vendorInfo.isActive).to.be.false;
    });

    it("Should allow owner to pause contract", async function () {
      await pagalayPayments.pause();
      
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("paused_transaction");
      
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");

      await expect(
        pagalayPayments.connect(customer).makePayment(
          vendor.address,
          transactionId,
          "Compra mientras pausado",
          { value: paymentAmount }
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Statistics", function () {
    beforeEach(async function () {
      await pagalayPayments.connect(vendor).registerVendor("Tienda María", "La Paz, Bolivia");
    });

    it("Should track total transactions and volume", async function () {
      const paymentAmount1 = ethers.utils.parseEther("1.0");
      const paymentAmount2 = ethers.utils.parseEther("2.0");
      
      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        ethers.utils.id("transaction_1"),
        "Compra 1",
        { value: paymentAmount1 }
      );

      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        ethers.utils.id("transaction_2"),
        "Compra 2",
        { value: paymentAmount2 }
      );

      const stats = await pagalayPayments.getContractStats();
      expect(stats._totalTransactions).to.equal(2);
      expect(stats._totalVolume).to.equal(paymentAmount1.add(paymentAmount2));
    });

    it("Should track user transactions", async function () {
      const paymentAmount = ethers.utils.parseEther("1.0");
      const transactionId = ethers.utils.id("user_transaction");
      
      await pagalayPayments.connect(customer).makePayment(
        vendor.address,
        transactionId,
        "Compra de productos",
        { value: paymentAmount }
      );

      const customerTransactions = await pagalayPayments.getUserTransactions(customer.address);
      const vendorTransactions = await pagalayPayments.getUserTransactions(vendor.address);
      
      expect(customerTransactions.length).to.equal(1);
      expect(vendorTransactions.length).to.equal(1);
      expect(customerTransactions[0]).to.equal(transactionId);
      expect(vendorTransactions[0]).to.equal(transactionId);
    });
  });

  // Helper function to get block timestamp
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock('latest');
    return block.timestamp;
  }
});
