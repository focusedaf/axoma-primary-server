import prisma from "./db";
import bcrypt from "bcrypt";

async function main() {
  const existing = await prisma.admin.findUnique({
    where: { email: "admin@test.com" },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.create({
    data: {
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
