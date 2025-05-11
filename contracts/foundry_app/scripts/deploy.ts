import { ethers } from "hardhat";
import { verify } from "../utils/verify";
import { saveDeploymentInfo } from "../utils/deployment";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Contract parameters
  const name = "GECKHO NFT";
  const symbol = "GECKHO";
  const mintPrice = ethers.parseEther("0.1"); // 0.1 ETH
  const royaltyReceiver = deployer.address;
  const royaltyFeeNumerator = 500; // 5%

  // Deploy contract
  const GECKHONFT = await ethers.getContractFactory("GECKHONFT");
  const geckhoNFT = await GECKHONFT.deploy(
    name,
    symbol,
    mintPrice,
    royaltyReceiver,
    royaltyFeeNumerator
  );

  await geckhoNFT.waitForDeployment();
  const contractAddress = await geckhoNFT.getAddress();

  console.log("GECKHONFT deployed to:", contractAddress);

  // Save deployment info
  await saveDeploymentInfo({
    contractName: "GECKHONFT",
    contractAddress,
    constructorArgs: [name, symbol, mintPrice, royaltyReceiver, royaltyFeeNumerator],
    network: network.name,
    deployer: deployer.address
  });

  // Verify contract on Etherscan
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await geckhoNFT.deployTransaction.wait(6); // Wait for 6 block confirmations

    console.log("Verifying contract...");
    await verify(contractAddress, [
      name,
      symbol,
      mintPrice,
      royaltyReceiver,
      royaltyFeeNumerator
    ]);
  }

  // Initial setup
  console.log("Setting up initial contract state...");
  
  // Add deployer to whitelist
  const addToWhitelistTx = await geckhoNFT.addToWhitelist(deployer.address);
  await addToWhitelistTx.wait();
  console.log("Added deployer to whitelist");

  // Enable public minting (optional)
  const enablePublicMintingTx = await geckhoNFT.setPublicMinting(false);
  await enablePublicMintingTx.wait();
  console.log("Public minting disabled by default");

  console.log("Deployment and initial setup completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 