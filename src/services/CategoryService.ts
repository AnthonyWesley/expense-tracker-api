import { User } from "../models/User";
import { Category, CategoryInstance } from "../models/Category";

class CategoryService {
  async create(decodeId: number, { title, color, expense }: CategoryInstance) {
    try {
      const user = await User.findOne({
        where: { id: decodeId },
      });
      console.log("!!!!", decodeId);
      console.log("!!!!", user);

      if (!user) {
        throw new Error("User not found for category creation");
      }

      // const existingCategory = await Category.findOne({
      //   where: {  user_id: decodeId, title: title },
      // });

      // if (existingCategory) {
      //   throw new Error("Category with the same title already exists");
      // }

      const newCategory = await Category.create({
        title,
        color,
        expense,
        user_id: user.id,
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
        where: { user_id: decodeId },
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
    { title, color, expense }: CategoryInstance
  ) {
    try {
      const existingCategory = await Category.findOne({
        where: { user_id: decodeId, id: paramsId },
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
        where: { user_id: decodeId, id: paramsId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const deletedCategoriesCount = await Category.destroy({
        where: { user_id: decodeId, id: paramsId },
      });

      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}

export const categoryService = new CategoryService();
