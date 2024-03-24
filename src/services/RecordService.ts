import { Record } from "../models/Record";
import { User } from "../models/User";

type RecordType = {
  date: string;
  value: number;
  description: string;
  category: string;
};
class RecordService {
  async create(
    decodeId: number,
    { date, value, description, category }: RecordType
  ) {
    try {
      const user = await User.findOne({ where: { id: decodeId } });

      if (!user) {
        throw new Error("User not found for record creation");
      }

      const newRecord = await Record.create({
        date,
        value,
        description,
        category,
        userId: decodeId,
      });

      return newRecord;
    } catch (error) {
      console.error("Error in record creation:", error);
      throw new Error("Failed to create record");
    }
  }

  async read(decodeId: number) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }

      const categories = await Record.findAll({
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
    { date, value, description, category }: RecordType
  ) {
    try {
      const existingRecord = await Record.findOne({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingRecord) {
        throw new Error("Record not found");
      }

      const updatedCategory = await existingRecord.update({
        date,
        value,
        description,
        category,
      });

      return updatedCategory;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  async delete(paramsId: string, decodeId: number) {
    try {
      const existingRecord = await Record.findOne({
        where: { userId: decodeId, id: paramsId },
      });

      if (!existingRecord) {
        throw new Error("Record not found");
      }

      const deletedCategoriesCount = await Record.destroy({
        where: { userId: decodeId, id: paramsId },
      });

      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }

  async updateManyTitles(currentName: string, updateName: string) {
    try {
      const findRecords = await Record.update(
        { category: updateName.toUpperCase().trim() },
        { where: { category: currentName.toUpperCase().trim() } }
      );

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
