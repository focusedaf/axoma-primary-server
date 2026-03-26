import "dotenv/config";
import { ethers } from "ethers";

// Normalize private key (adds 0x if missing)
function normalizePK(pk: string) {
  if (!pk) throw new Error("ADMIN_PRIVATE_KEY missing");
  return pk.startsWith("0x") ? pk : `0x${pk}`;
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(
  normalizePK(process.env.ADMIN_PRIVATE_KEY!),
  provider,
);

async function debugNetwork() {
  const network = await provider.getNetwork();
  console.log("Network:", {
    name: network.name,
    chainId: network.chainId.toString(),
  });
}

debugNetwork();

async function main() {
  try {
    // Test RPC
    const blockNumber = await provider.getBlockNumber();
    console.log("Connected. Current block:", blockNumber);

    // Test wallet
    const balance = await provider.getBalance(wallet.address);
    console.log("Wallet:", wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
