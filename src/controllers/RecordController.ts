import { Request, Response } from "express";
import { decodeToken } from "../middleware/authorization";
import { recordService } from "../services/RecordService";

type RecordType = {
  date: string;
  value: number;
  description: string;
  category: string;
};
class RecordController {
  async create(req: Request, res: Response) {
    try {
      const { date, value, description, category } = req.body as RecordType;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const newRecord = await recordService.create(decode.userId, {
          date,
          value,
          description,
          category,
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const records = await recordService.read(decode.userId);

        return res.status(201).json({ success: true, records });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { date, value, description, category } = req.body as RecordType;
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const records = await recordService.update(id, decode.userId, {
          date,
          value,
          description,
          category,
        });

        return res.status(201).json({ success: true, records });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const deletedRecord = await recordService.delete(id, decode.userId);

        if (deletedRecord) {
          return res
            .status(200)
            .json({ success: true, message: `Record ID - ${id} - DELETED` });
        } else {
          return res
            .status(404)
            .json({ error: "Not Found", message: "Record doesn't exist" });
        }
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateManyTitles(req: Request, res: Response) {
    try {
      const { currentName, updateName } = req.body as {
        currentName: string;
        updateName: string;
      };
      // const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const categories = await recordService.updateManyTitles(
          currentName,
          updateName
        );

        return res.status(201).json({ success: true, categories });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const recordController = new RecordController();
