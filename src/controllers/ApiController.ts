import { Request, Response } from "express";
import { decodeToken } from "../middleware/authorization";

class ApiController<T> {
  private service: T;

  constructor(service: T) {
    this.service = service;
  }

  async create(req: Request, res: Response) {
    try {
      const dataBody = req.body;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const data = await (this.service as any).create(
          decode.userId,
          dataBody
        );

        return res.status(201).json({ success: true, data });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const data = await (this.service as any).read(
          decode.userId,
          req.params
        );
        return res.status(200).json({ success: true, data });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const dataBody = req.body;
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const data = await (this.service as any).update(
          id,
          decode.userId,
          dataBody
        );
        return res.status(200).json({ success: true, data });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const deletedDate = await (this.service as any).delete(
          id,
          decode.userId
        );
        if (deletedDate) {
          return res.status(200).json({
            success: true,
            message: `ID - ${id} - DELETED`,
          });
        } else {
          return res.status(404).json({
            error: "Not Found",
            message: `ID doesn't exist`,
          });
        }
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
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
        const categories = await (this.service as any).updateManyTitles(
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

export default ApiController;
