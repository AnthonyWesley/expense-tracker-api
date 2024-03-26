"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/RecordService.ts
var RecordService_exports = {};
__export(RecordService_exports, {
  recordService: () => recordService
});
module.exports = __toCommonJS(RecordService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var import_bcryptjs = __toESM(require("bcryptjs"));
var prismaClient = new import_client.PrismaClient();
prismaClient.$use(async (params, next) => {
  if (params.action === "create" && params.model === "User") {
    const hashedPassword = await import_bcryptjs.default.hash(params.args.data.password, 10);
    params.args.data.password = hashedPassword;
  }
  return next(params);
});

// src/services/RecordService.ts
var RecordService = class {
  async create(decodeId, { date, value, description, category }) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: decodeId }
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
          userId: decodeId
        }
      });
      return newRecord;
    } catch (error) {
      console.error("Error in record creation:", error);
      throw new Error("Failed to create record");
    }
  }
  async read(decodeId) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }
      const categories = await prismaClient.record.findMany({
        where: { userId: decodeId }
      });
      return categories;
    } catch (error) {
      console.error("Error in reading categories:", error);
      throw new Error("Failed to read categories");
    }
  }
  async update(paramsId, decodeId, { date, value, description, category }) {
    try {
      const existingRecord = await prismaClient.record.findUnique({
        where: { userId: decodeId, id: paramsId }
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
          category
        }
      });
      return updatedCategory;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }
  async delete(paramsId, decodeId) {
    try {
      const existingRecord = await prismaClient.record.findUnique({
        where: { userId: decodeId, id: paramsId }
      });
      if (!existingRecord) {
        throw new Error("Record not found");
      }
      const deletedCategoriesCount = await prismaClient.record.delete({
        where: { userId: decodeId, id: paramsId }
      });
      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
  async updateManyTitles(currentName, updateName) {
    console.log(currentName, updateName);
    try {
      const findRecords = await prismaClient.record.updateMany({
        where: { category: currentName.toUpperCase().trim() },
        data: { category: updateName.toUpperCase().trim() }
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
};
var recordService = new RecordService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  recordService
});
