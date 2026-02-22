import { PrismaClient } from "./generated/prisma/client";
import { env } from "../config/env";

const prismaClientSingleton = () =>
  new PrismaClient({
    accelerateUrl: env.DATABASE_URL,
  });

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;
