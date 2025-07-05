import { ethers } from "ethers";
import CrowdfundABI from "../artifacts/Crowdfund.json"; // adjust path

export const deployCrowdfund = async (goalInEth, durationInDays) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const goalInWei = ethers.parseEther(goalInEth);
  const durationInSeconds = durationInDays * 86400;

  const CrowdfundFactory = new ethers.ContractFactory(
    CrowdfundABI.abi,
    CrowdfundABI.bytecode,
    signer
  );

  const contract = await CrowdfundFactory.deploy(goalInWei, durationInSeconds);
  await contract.waitForDeployment();
  return contract;
};
