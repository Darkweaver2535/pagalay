const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Desplegando contratos de Pagalay...");

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  console.log("💰 Balance de la cuenta:", ethers.utils.formatEther(await deployer.getBalance()));

  // Dirección del fee collector (por ahora será el deployer)
  const feeCollector = deployer.address;

  // Desplegar PagalayPayments
  const PagalayPayments = await ethers.getContractFactory("PagalayPayments");
  const pagalayPayments = await PagalayPayments.deploy(feeCollector);

  await pagalayPayments.deployed();

  console.log("✅ PagalayPayments desplegado en:", pagalayPayments.address);
  console.log("📊 Fee collector configurado en:", feeCollector);

  // Verificar el contrato en Polygonscan si no estamos en localhost
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Esperando confirmaciones antes de verificar...");
    await pagalayPayments.deployTransaction.wait(6);

    try {
      await hre.run("verify:verify", {
        address: pagalayPayments.address,
        constructorArguments: [feeCollector],
      });
      console.log("✅ Contrato verificado en Polygonscan!");
    } catch (error) {
      console.log("❌ Error verificando contrato:", error.message);
    }
  }

  // Guardar las direcciones para uso posterior
  const deploymentInfo = {
    network: hre.network.name,
    pagalayPayments: pagalayPayments.address,
    feeCollector: feeCollector,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
  };

  console.log("\n📋 Información del deployment:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Configuraciones iniciales opcionales
  console.log("\n⚙️ Configurando parámetros iniciales...");
  
  // El fee ya está configurado en 1.5% por defecto en el constructor
  console.log("💳 Fee de transacción: 1.5%");
  
  console.log("\n🎉 Deployment completado exitosamente!");
  console.log("🔗 Puedes interactuar con el contrato en:", pagalayPayments.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error en el deployment:", error);
    process.exit(1);
  });
