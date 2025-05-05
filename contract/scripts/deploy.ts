import * as dotenv from 'dotenv';

import { ethers } from 'hardhat';

dotenv.config();

async function main() {
  const LotteryFactory = await ethers.getContractFactory('Lottery');
  const lottery = await LotteryFactory.deploy(process.env.CHAINLINK_VRF_SUBSCRIPTION_ID!);

  await lottery.waitForDeployment();

  const lotteryAddress = await lottery.getAddress();
  console.log(`Contract deployed to: ${lotteryAddress}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
