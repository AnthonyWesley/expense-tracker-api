import { User } from "../models/User";
import { Category } from "../models/Category";

type CategoryType = {
  title: string;
  color: string;
  expense: boolean;
};

class CategoryService {
  async create(decodeId: number, { title, color, expense }: CategoryType) {
    try {
      const user = await User.findOne({
        where: { id: decodeId },
      });

      if (!user) {
        throw new Error("User not found for category creation");
      }

      // const existingCategory = await Category.findOne({
      //   where: { userId: decodeId, title: title },
      // });

      // if (existingCategory) {
      //   throw new Error("Category with the same title already exists");
      // }

      const newCategory = await Category.create({
        title,
        color,
        expense,
        userId: decodeId,
      });

      return newCategory;
    } catch (error) {
      console.error("Error in category creation:", error);
      throw new Error("Failed to create category");
    }
  }

  async read(decodeId: number) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }

      const categories = await Category.findAll({
        where: { userId: decodeId },
      });

      return categories;
    } catch (error) {
      console.error("Error in reading categories:", error);
      throw new Error("Failed to read categories");
    }
  }

  async update(
    paramsId: string,
    decodeId: number,
    { title, color, expense }: CategoryType
  ) {
    try {
      const existingCategory = await Category.findOne({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const updatedCategory = await existingCategory.update({
        title,
        color,
        expense,
      });

      return updatedCategory;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  async delete(paramsId: string, decodeId: number) {
    try {
      const existingCategory = await Category.findOne({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const deletedCategoriesCount = await Category.destroy({
        where: { userId: decodeId, id: paramsId },
      });

      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}

export const categoryService = new CategoryService();
