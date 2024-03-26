import { prismaClient } from "../prisma";

type RecordType = {
  date: string;
  value: number;
  description: string;
  category: string;
};
class RecordService {
  async create(
    decodeId: string,
    { date, value, description, category }: RecordType
  ) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: decodeId },
      });

      if (!user) {
        throw new Error("User not found for record creation");
      }

      const newRecord = await prismaClient.record.create({
        data: {
          date,
          value,
          description,
          category,
          userId: decodeId,
        },
      });

      return newRecord;
    } catch (error) {
      console.error("Error in record creation:", error);
      throw new Error("Failed to create record");
    }
  }

  async read(decodeId: string) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }

      const categories = await prismaClient.record.findMany({
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
    { date, value, description, category }: RecordType
  ) {
    try {
      const existingRecord = await prismaClient.record.findUnique({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingRecord) {
        throw new Error("Record not found");
      }

      const updatedCategory = await prismaClient.record.update({
        where: { id: paramsId },
        data: {
          date,
          value,
          description,
          category,
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
      const existingRecord = await prismaClient.record.findUnique({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingRecord) {
        throw new Error("Record not found");
      }

      const deletedCategoriesCount = await prismaClient.record.delete({
        where: { userId: decodeId, id: paramsId },
      });

      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }

  async updateManyTitles(currentName: string, updateName: string) {
    console.log(currentName, updateName);

    try {
      const findRecords = await prismaClient.record.updateMany({
        where: { category: currentName.toUpperCase().trim() },
        data: { category: updateName.toUpperCase().trim() },
      });

      if (!findRecords) {
        throw new Error("Registers not found");
      }

      return findRecords;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }
}

export const recordService = new RecordService();
