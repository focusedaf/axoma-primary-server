import { z } from "zod";


export const candidateOnboardingSchema = z.object({
  universityName: z.string().min(1, "University name is required"),
  collegeName: z.string().min(1, "College name is required"),
  majorName: z.string().min(1, "Major name is required"),
  currentSem: z.number().min(1, "Semester must be at least 1"),
  startYear: z.string().regex(/^\d{4}$/, "Start year must be 4 digits"),
  gradYear: z.string().regex(/^\d{4}$/, "Graduation year must be 4 digits"),
});



export const professorOnboardingSchema = z.object({
  universityName: z.string().min(1),
  collegeName: z.string().min(1),
  department: z.string().min(1),
  designation: z.string().min(1),
  employmentType: z.enum(["full_time", "visiting", "contract"]),
  joiningYear: z.number().min(1900).max(new Date().getFullYear()),
});



export const recruiterOnboardingSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  department: z.string().min(1),
  designation: z.string().min(1),
  employmentType: z.enum(["full_time", "part_time", "contract", "intern"]),
  companyWebsite: z.string().url().optional(),
  linkedinProfile: z.string().url().optional(),
  joiningYear: z.number().min(1900).max(new Date().getFullYear()),
});



export const institutionOnboardingSchema = z.object({
  institutionName: z.string().min(1),
  industry: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  institutionType: z.enum([
    "university",
    "college",
    "school",
    "training_institute",
  ]),
  institutionWebsite: z.string().url().optional(),
  yearEstablished: z.number().min(1800).max(new Date().getFullYear()),
});



export const getOnboardingSchemaByRole = (role: string) => {
  switch (role) {
    case "candidate":
      return candidateOnboardingSchema;
    case "professor":
      return professorOnboardingSchema;
    case "recruiter":
      return recruiterOnboardingSchema;
    case "institution":
      return institutionOnboardingSchema;
    default:
      throw new Error("Invalid role");
  }
};
