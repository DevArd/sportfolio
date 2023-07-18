// npx hardat run ./scripts/01_deployContracts.js --network goerli
const { ethers } = require("hardhat");

// Scripts/deploy.js
async function main() {
  // Deploy the Sportfolio talent tokens
  const messiSportfolioToken = await ethers.deployContract("MessiSportfolioToken");
  await messiSportfolioToken.waitForDeployment();
  const MessiTokenAddress = await messiSportfolioToken.getAddress();
  console.log("MessiSportfolioToken déployé à l'adresse :", MessiTokenAddress);
  const mbappeTalentToken = await ethers.deployContract("MBappeSportfolioToken");
  await mbappeTalentToken.waitForDeployment();
  const MBappeTokenAddress = await mbappeTalentToken.getAddress();
  console.log("MBappeSportfolioToken déployé à l'adresse :", MBappeTokenAddress);

  // Deploy the USDC tokens
  const usdcRewardsToken = await ethers.deployContract("FakeUSDC");
  await usdcRewardsToken.waitForDeployment();
  const fakeUSDCAddress = await usdcRewardsToken.getAddress();
  console.log("FakeUSDC déployé à l'adresse :", fakeUSDCAddress);

  // Deploy the staking contract MessiSportfolioToken/FakeUSDC
  const stakingMessiUsdcContract = await ethers.deployContract("SportfolioTalentStaking", [messiSportfolioToken, fakeUSDCAddress]);
  await stakingMessiUsdcContract.waitForDeployment();
  console.log("SportfolioTalentStaking MessiSportfolioToken/FakeUSDC déployé à l'adresse :", await stakingMessiUsdcContract.getAddress());

  // Deploy the staking contract MBappeSportfolioToken/FakeUSDC
  const stakingMBappeUsdcContract = await ethers.deployContract("SportfolioTalentStaking", [mbappeTalentToken, fakeUSDCAddress]);
  await stakingMBappeUsdcContract.waitForDeployment();
  console.log("SportfolioTalentStaking MBappeSportfolioToken/FakeUSDC déployé à l'adresse :", await stakingMBappeUsdcContract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
