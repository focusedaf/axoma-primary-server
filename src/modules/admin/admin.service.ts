import bcrypt from "bcrypt";
import prisma from "../../db/db";
import { IssuerStatus } from "../../db/generated/prisma";
import { adminRepository } from "./admin.repository";
import { ethers } from "ethers";
import IssuerRegistryABI from "../abi/IssuerRegistry.json";
import { sendNotification } from "../../utils/notify";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

function normalizePK(pk: string) {
  return pk.startsWith("0x") ? pk : `0x${pk}`;
}

function getAdminSigner() {
  if (!process.env.ADMIN_PRIVATE_KEY) {
    throw new Error("Admin private key missing");
  }

  const wallet = new ethers.Wallet(
    normalizePK(process.env.ADMIN_PRIVATE_KEY),
    provider,
  );

  if (
    process.env.ADMIN_WALLET_ADDRESS &&
    wallet.address.toLowerCase() !==
      process.env.ADMIN_WALLET_ADDRESS.toLowerCase()
  ) {
    throw new Error("Admin wallet mismatch");
  }

  return wallet;
}

export const adminService = {
  login: async (email: string, password: string) => {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return admin;
  },

  getById: async (id: string) => {
    const admin = await adminRepository.getAdminById(id);
    if (!admin) throw new Error("Admin not found");
    return admin;
  },

  fetchIssuers: async (status?: IssuerStatus) => {
    const pendingCount = await prisma.issuer.count({
      where: { status: "pending" },
    });

    if (pendingCount > 0) {
      const admins = await prisma.admin.findMany();

      for (const admin of admins) {
        await sendNotification(
          admin.id,
          "pending_alert",
          `You have ${pendingCount} pending issuers`,
        );
      }
    }

    return adminRepository.getIssuers(status);
  },

  approveIssuer: async (issuerId: string) => {
    const issuer = await prisma.issuer.findUnique({
      where: { id: issuerId },
    });

    if (!issuer || !issuer.walletAddress) {
      throw new Error("Issuer wallet missing");
    }

    const signer = getAdminSigner();

    const contract = new ethers.Contract(
      process.env.ISSUER_REGISTRY_ADDRESS!,
      IssuerRegistryABI,
      signer,
    );

    const tx = await contract.approveIssuer(issuer.walletAddress);
    await tx.wait();

    const updated = await adminRepository.approveIssuer(issuerId);

    await sendNotification(
      issuerId,
      "issuer_approved",
      "Your account has been approved",
    );

    return updated;
  },

  suspendIssuer: async (issuerId: string) => {
    const updated = await adminRepository.suspendIssuer(issuerId);

    await sendNotification(
      issuerId,
      "issuer_suspended",
      "Your account has been suspended",
    );

    return updated;
  },
};