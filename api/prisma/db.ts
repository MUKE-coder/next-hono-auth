import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export function getPrisma(database_url: string) {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
    transactionOptions: {
      maxWait: 10000, // default: 2000
      timeout: 15000, // default: 5000
    },
  }).$extends(withAccelerate());
  return prisma;
}
