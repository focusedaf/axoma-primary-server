// request validation schema

import z from "zod";

export const candidateRegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  mobileNumber: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const issuerRegisterSchema = z
  .object({
    role: z.enum(["professor", "institution", "recruiter"]),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    institutionName: z.string().optional(),
    mobileNumber: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    walletAddress: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "institution" && !data.institutionName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Institution name is required for institutions",
        path: ["institutionName"],
      });
    }

    if (
      (data.role === "professor" || data.role === "recruiter") &&
      (!data.firstName || !data.lastName)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "First and last name required for individuals",
        path: ["firstName"],
      });
    }
  });
