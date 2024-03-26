import { Request, Response } from "express";
import { decodeToken } from "../middleware/authorization";
import { categoryService } from "../services/CategoryService";

type CategoryType = {
  title: string;
  color: string;
  expense: boolean;
};
class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const { title, color, expense } = req.body as CategoryType;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };
      console.log(decode);

      if (decode && decode.userId) {
        const categories = await categoryService.create(decode.userId, {
          title: title.toUpperCase(),
          color,
          expense,
        });

        return res.status(201).json({ success: true, categories });
      } else {
        return res
          .status(401)
          .json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const categories = await categoryService.read(decode.userId);

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

  async update(req: Request, res: Response) {
    try {
      const { title, color, expense } = req.body as CategoryType;
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const categories = await categoryService.update(id, decode.userId, {
          title: title.toUpperCase(),
          color,
          expense,
        });

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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization as string;
      const decode = decodeToken(token) as { userId: string };

      if (decode && decode.userId) {
        const deletedCategory = await categoryService.delete(id, decode.userId);

        if (deletedCategory) {
          return res
            .status(200)
            .json({ success: true, message: `Record ID - ${id} - DELETED` });
        } else {
          return res
            .status(404)
            .json({ error: "Not Found", message: "Category doesn't exist" });
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
}
export const categoryController = new CategoryController();
