import "dotenv/config";
import { ethers } from "ethers";
import IssuerRegistryABI from "./modules/abi/IssuerRegistry.json";

// Normalize private key (adds 0x if missing)
function normalizePK(pk: string) {
  if (!pk) throw new Error("ADMIN_PRIVATE_KEY missing in .env");
  return pk.startsWith("0x") ? pk : `0x${pk}`;
}

// Provider & wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(
  normalizePK(process.env.ADMIN_PRIVATE_KEY!),
  provider,
);

// Contract instance
const contract = new ethers.Contract(
  process.env.ISSUER_REGISTRY_ADDRESS!,
  IssuerRegistryABI,
  wallet,
);

// Debug network
async function debugNetwork() {
  const network = await provider.getNetwork();
  console.log("Network:", {
    name: network.name,
    chainId: network.chainId.toString(),
  });
}

// Approve self (test)
async function approveSelf() {
  try {
    const tx = await contract.approveIssuer(wallet.address);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Approved self successfully");
  } catch (err) {
    console.error("Failed to approve:", err);
  }
}

// Main execution
async function main() {
  await debugNetwork();

  try {
    // Current block
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block:", blockNumber);

    // Wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Wallet:", wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");

    // Approve self
    await approveSelf();
  } catch (err) {
    console.error("Error in main execution:", err);
  }
}

main();
