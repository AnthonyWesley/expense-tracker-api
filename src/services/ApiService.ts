import { prismaClient } from "../prisma";
import { ulid } from "ulid";

export class ApiService<T> {
  private entityName: string;
  private prismaInstance: T;

  constructor(entityName: string, prismaInstance: T) {
    this.prismaInstance = prismaInstance;
    this.entityName = entityName;
  }

  async create(decodeId: string, data: any) {
    try {
      if ("account_id" in data) {
        const user = await prismaClient.user.findUnique({
          where: {
            id: decodeId,
          },
          include: {
            accounts: {
              where: {
                id: data.account_id,
              },
            },
          },
        });

        if (!user) {
          throw new Error(`User not found for ${this.entityName} creation`);
        }

        const newData = await (this.prismaInstance as any).create({
          data: { ...data, id: ulid(), accountId: data.accountId },
        });

        return newData;
      } else {
        const user = await prismaClient.user.findUnique({
          where: { id: decodeId },
        });

        if (!user) {
          throw new Error(`User not found for ${this.entityName} creation`);
        }

        const newData = await (this.prismaInstance as any).create({
          data: { ...data, id: ulid(), user_id: decodeId },
        });

        return newData;
      }
    } catch (error) {
      console.error(`Error in ${this.entityName} creation:`, error);
      throw new Error(`Failed to create ${this.entityName}`);
    }
  }

  async read(decodeId: string, paramsId: { id: string }) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }

      if ("id" in paramsId) {
        const newData2 = await (this.prismaInstance as any).findMany({
          where: { user_id: decodeId },
          include: { records: { where: { account_id: paramsId.id } } },
        });
        const data = newData2.filter((item: any) => item.id == paramsId.id);

        return data[0].records;
      } else {
        const data = await (this.prismaInstance as any).findMany({
          where: { user_id: decodeId },
        });
        if (data.length > 0) {
          if ("branch" in data[0]) {
            const data = await (this.prismaInstance as any).findMany({
              where: { user_id: decodeId },
              include: { records: true },
            });
            return data;
          }
        }

        return data;
      }
    } catch (error) {
      console.error(`Error in reading ${this.entityName}:`, error);
      throw new Error(`Failed to read ${this.entityName}`);
    }
  }

  async update(paramsId: string, decodeId: string, data: any) {
    try {
      if (this.entityName === "record") {
        const newData = await prismaClient.record.update({
          where: { id: paramsId },
          data: data,
        });

        return newData;
      } else {
        const findDate = await (this.prismaInstance as any).findUnique({
          where: { user_id: decodeId, id: paramsId },
        });

        if (!findDate) {
          throw new Error(`${this.entityName} not found`);
        }

        const newData = await (this.prismaInstance as any).update({
          where: { id: paramsId },
          data: data,
        });

        return newData;
      }
    } catch (error) {
      console.error(`Error in updating ${this.entityName}:`, error);
      throw new Error(`Failed to update ${this.entityName}`);
    }
  }

  async delete(paramsId: string, decodeId: string) {
    try {
      if (this.entityName === "record") {
        const findDate = await prismaClient.record.delete({
          where: { id: paramsId },
        });
        return findDate;
      } else {
        const newData = await (this.prismaInstance as any).findUnique({
          where: { user_id: decodeId, id: paramsId },
        });

        if (!newData) {
          throw new Error(`${this.entityName} not found`);
        }

        const findDate = await (this.prismaInstance as any).delete({
          where: { user_id: decodeId, id: paramsId },
        });

        return findDate;
      }
    } catch (error) {
      console.error(`Error in deleting ${this.entityName}:`, error);
      throw new Error(`Failed to delete ${this.entityName}`);
    }
  }

  async updateManyTitles(currentName: string, updateName: string) {
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
