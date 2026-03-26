import prisma from "../../db/db";
import csvParser from "csv-parser";
import { Readable } from "stream";

export async function validateIssuer(issuerId: string) {
  const issuer = await prisma.issuer.findUnique({
    where: { id: issuerId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!issuer) throw new Error("Issuer not found");

  if (!["professor", "institution", "recruiter"].includes(issuer.role)) {
    throw new Error("Not a valid issuer");
  }

  if (issuer.status !== "approved") {
    throw new Error("Issuer not approved");
  }

  return issuer;
}

export async function uploadCandidatesCSV(
  issuerId: string,
  examId: string,
  fileBuffer: Buffer,
) {
  await validateIssuer(issuerId);

  const results: { email: string }[] = [];

  return new Promise((resolve, reject) => {
    const stream = Readable.from(fileBuffer);

    stream
      .pipe(csvParser())
      .on("data", (data) => {
        if (data.email) {
          results.push({ email: data.email.trim() });
        }
      })
      .on("end", async () => {
        try {
          const data = results.map((r) => ({
            examId,
            email: r.email,
            allowed: true,
          }));

          await prisma.examCandidate.createMany({
            data,
            skipDuplicates: true,
          });

          resolve({ count: data.length });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}