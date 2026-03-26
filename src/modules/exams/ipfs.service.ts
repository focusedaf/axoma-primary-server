import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!,
);

export async function uploadExamToIPFS(data: any) {
  try {
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      throw new Error("Pinata credentials missing in environment variables");
    }

    const response = await pinata.pinJSONToIPFS(data, {
      pinataMetadata: {
        name: `exam-${Date.now()}`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    return response.IpfsHash;
  } catch (error) {
    console.error("Pinata upload failed:", error);
    throw new Error("IPFS upload failed");
  }
}
