import { prismaClient } from "../prisma";

export interface CategoryInstance {
  id?: string;
  title: string;
  color: string;
  expense: boolean;
}

class CategoryService {
  async create(decodeId: string, { title, color, expense }: CategoryInstance) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: decodeId },
      });

      if (!user) {
        throw new Error("User not found for category creation");
      }

      // const existingCategory = await prismaClient.category.findUnique({
      //   where: {  userId: decodeId, title: title },
      // });

      // if (existingCategory) {
      //   throw new Error("Category with the same title already exists");
      // }

      const newCategory = await prismaClient.category.create({
        data: {
          title,
          color,
          expense,
          userId: decodeId,
        },
      });

      return newCategory;
    } catch (error) {
      console.error("Error in category creation:", error);
      throw new Error("Failed to create category");
    }
  }

  async read(decodeId: string) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }

      const categories = await prismaClient.category.findMany({
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
    decodeId: string,
    { title, color, expense }: CategoryInstance
  ) {
    try {
      const existingCategory = await prismaClient.category.findUnique({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const updatedCategory = await prismaClient.category.update({
        where: { id: paramsId },
        data: {
          title,
          color,
          expense,
        },
      });

      return updatedCategory;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  async delete(paramsId: string, decodeId: string) {
    try {
      const existingCategory = await prismaClient.category.findUnique({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const deletedCategoriesCount = await prismaClient.category.delete({
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
