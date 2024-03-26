import { Request, Response } from "express";
import { decodeToken, generateToken } from "../middleware/authorization";
import { userService } from "../services/UserService";
class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Missing Data. Please provide all required information.",
        });
      }

      const createUser = await userService.register({ name, email, password });
      if (createUser) {
        return res.status(201).json({
          success: true,
          message: "User created successfully",
          data: { email },
        });
      } else {
        return res
          .status(409)
          .json({ error: "Conflict", message: "Email already exists" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await userService.login({ email, password });
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      const accessToken = generateToken(user.id);
      const refreshToken = generateToken(user.id, "7d");
      if (accessToken) {
        res.status(200).json({
          success: true,
          user,
          token: { accessToken, refreshToken },
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken as string;

    if (!refreshToken)
      res.status(401).json({ error: "Unauthorized", message: "Invalid token" });

    const decode = decodeToken(refreshToken) as { userId: string };

    const accessToken = generateToken(decode.userId);

    return res
      .status(200)
      .json({ success: true, token: { accessToken, refreshToken } });
  }
}

export const userController = new UserController();
