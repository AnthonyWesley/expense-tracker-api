import { Request, Response } from "express";
import { User } from "../models/User";
import { decodeToken, generateToken } from "../middleware/authorization";
import { Record } from "../models/Record";
import bcrypt from "bcryptjs";

class ExpensesController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        const createUser = await User.create({ name, email, password });
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

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password",
        });
      }

      const decryptedPassword = await bcrypt.compare(password, user.password);

      if (!decryptedPassword) {
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

  async createRecord(req: Request, res: Response) {
    try {
      const { date, value, description, category } = req.body;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: number };

      const user = await User.findOne({ where: { id: decode.userId } });

      if (user) {
        const newRecord = await Record.create({
          date,
          value,
          description,
          category,
          userId: decode.userId,
        });

        return res
          .status(201)
          .json({ success: true, data: { record: newRecord } });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async readRecord(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: number };

      const records = await Record.findAll({
        where: { userId: decode.userId },
      });

      if (records && records.length > 0) {
        return res.status(200).json({ success: true, records });
      } else {
        return res
          .status(404)
          .json({ error: "Not Found", message: "User records not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateRecord(req: Request, res: Response) {
    try {
      const { date, value, description, category } = req.body;
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      const existingRecord = await Record.findOne({
        where: { userId: decode.userId, id: id },
      });

      if (!existingRecord) {
        return res
          .status(404)
          .json({ error: "Not Found", message: "Record not found" });
      }

      const updatedRecord = await existingRecord.update({
        date,
        value,
        description,
        category,
      });

      return res
        .status(200)
        .json({ success: true, data: { record: updatedRecord } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      const deletedRecordsCount = await Record.destroy({
        where: { userId: decode.userId, id: id },
      });

      if (deletedRecordsCount) {
        return res
          .status(200)
          .json({ success: true, message: `Record ID - ${id} - DELETED` });
      } else {
        return res
          .status(404)
          .json({ error: "Not Found", message: "Record doesn't exist" });
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

    const decode = decodeToken(refreshToken) as { userId: number };

    const accessToken = generateToken(decode.userId);

    return res
      .status(200)
      .json({ success: true, token: { accessToken, refreshToken } });
  }

  async pingPong(req: Request, res: Response) {
    const records = await Record.findAll();

    return res.status(200).json({ success: true, records });
  }
}

export const expensesController = new ExpensesController();
