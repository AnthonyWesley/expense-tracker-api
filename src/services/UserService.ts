import bcrypt from "bcryptjs";
import { prismaClient } from "../prisma";
import { ulid } from "ulid";

type UserType = {
  name?: string;
  email: string;
  password: string;
};
class UserService {
  async register({ name, email, password }: UserType) {
    console.log(name, email, password);
    try {
      const user = await prismaClient.user.findUnique({ where: { email } });
      console.log("User findUnique result:", user);

      if (!user) {
        const createUser = await prismaClient.user.create({
          data: { id: ulid(), name: name || "", email, password },
        });
        console.log("User created:", createUser);

        const category = await prismaClient.category.create({
          data: {
            id: ulid(),
            name: "MERCADO",
            color: "red",
            expense: true,
            user_id: createUser.id,
          },
        });
        console.log("Category created:", category);

        const account = await prismaClient.account.create({
          data: {
            id: ulid(),
            name: "CONTA PRINCIPAL",
            number: "012345-6",
            branch: "012",
            type: "Corrente",
            user_id: createUser.id,
          },
        });
        console.log("Account created:", account);

        return createUser;
      }
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error("Failed to create user");
    }
  }

  async login({ email, password }: UserType) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email },
        // include: {
        //   accounts: {
        //     include: {
        //       records: true,
        //     },
        //   },
        // },
      });

      if (user) {
        const decryptedPassword = await bcrypt.compare(password, user.password);

        if (decryptedPassword) {
          return user;
        }
      }
    } catch (error) {
      console.error("Error in user login:", error);
      throw new Error("Failed to login user");
    }
  }
}

export const userService = new UserService();
