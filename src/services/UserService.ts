import bcrypt from "bcryptjs";
import { User } from "../models/User";

type UserType = {
  name?: string;
  email: string;
  password: string;
};
class UserService {
  async register({ name, email, password }: UserType) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        const createUser = await User.create({ name, email, password });
        return createUser;
      }
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error("Failed to create user");
    }
  }
  async login({ email, password }: UserType) {
    try {
      const user = await User.findOne({ where: { email } });
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
