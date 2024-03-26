import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const prismaClient = new PrismaClient();

prismaClient.$use(async (params, next) => {
  if (params.action === "create" && params.model === "User") {
    const hashedPassword = await bcrypt.hash(params.args.data.password, 10);
    params.args.data.password = hashedPassword;
  }
  return next(params);
});
