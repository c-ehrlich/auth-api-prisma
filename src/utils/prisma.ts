import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log('created Prisma Client');

export default prisma;
