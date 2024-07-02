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

// src/route/ApiRouter.ts
var ApiRouter_exports = {};
__export(ApiRouter_exports, {
  ApiRouter: () => ApiRouter
});
module.exports = __toCommonJS(ApiRouter_exports);

// src/middleware/authorization.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var decodeToken = (token) => {
  try {
    const decode = import_jsonwebtoken.default.decode(token);
    return decode;
  } catch (error) {
    return null;
  }
};

// src/controllers/ApiController.ts
var ApiController = class {
  constructor(service) {
    this.service = service;
  }
  async create(req, res) {
    try {
      const dataBody = req.body;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const data = await this.service.create(
          decode.userId,
          dataBody
        );
        return res.status(201).json({ success: true, data });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async read(req, res) {
    try {
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const data = await this.service.read(
          decode.userId,
          req.params
        );
        return res.status(200).json({ success: true, data });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async update(req, res) {
    try {
      const dataBody = req.body;
      const { id } = req.params;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const data = await this.service.update(
          id,
          decode.userId,
          dataBody
        );
        return res.status(200).json({ success: true, data });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const deletedDate = await this.service.delete(
          id,
          decode.userId
        );
        if (deletedDate) {
          return res.status(200).json({
            success: true,
            message: `ID - ${id} - DELETED`
          });
        } else {
          return res.status(404).json({
            error: "Not Found",
            message: `ID doesn't exist`
          });
        }
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async updateManyTitles(req, res) {
    try {
      const { currentName, updateName } = req.body;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const categories = await this.service.updateManyTitles(
          currentName,
          updateName
        );
        return res.status(201).json({ success: true, categories });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
var ApiController_default = ApiController;

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

// src/services/ApiService.ts
var import_ulid = require("ulid");
var ApiService = class {
  constructor(entityName, prismaInstance) {
    this.prismaInstance = prismaInstance;
    this.entityName = entityName;
  }
  async create(decodeId, data) {
    try {
      if ("accountId" in data) {
        const user = await prismaClient.user.findUnique({
          where: {
            id: decodeId
          },
          include: {
            accounts: {
              where: {
                id: data.accountId
              }
            }
          }
        });
        if (!user) {
          throw new Error(`User not found for ${this.entityName} creation`);
        }
        const newData = await this.prismaInstance.create({
          data: { ...data, id: (0, import_ulid.ulid)(), accountId: data.accountId }
        });
        return newData;
      } else {
        const user = await prismaClient.user.findUnique({
          where: { id: decodeId }
        });
        if (!user) {
          throw new Error(`User not found for ${this.entityName} creation`);
        }
        const newData = await this.prismaInstance.create({
          data: { ...data, id: (0, import_ulid.ulid)(), user_id: decodeId }
        });
        return newData;
      }
    } catch (error) {
      console.error(`Error in ${this.entityName} creation:`, error);
      throw new Error(`Failed to create ${this.entityName}`);
    }
  }
  async read(decodeId, paramsId) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }
      if ("id" in paramsId) {
        const newData2 = await this.prismaInstance.findMany({
          where: { user_id: decodeId },
          include: { records: { where: { account_id: paramsId.id } } }
        });
        const data = newData2.filter((item) => item.id == paramsId.id);
        return data[0].records;
      } else {
        const data = await this.prismaInstance.findMany({
          where: { user_id: decodeId }
        });
        if (data.length > 0) {
          if ("branch" in data[0]) {
            const data2 = await this.prismaInstance.findMany({
              where: { user_id: decodeId },
              include: { records: true }
            });
            return data2;
          }
        }
        return data;
      }
    } catch (error) {
      console.error(`Error in reading ${this.entityName}:`, error);
      throw new Error(`Failed to read ${this.entityName}`);
    }
  }
  async update(paramsId, decodeId, data) {
    try {
      if (this.entityName === "record") {
        const newData = await prismaClient.record.update({
          where: { id: paramsId },
          data
        });
        return newData;
      } else {
        const findDate = await this.prismaInstance.findUnique({
          where: { user_id: decodeId, id: paramsId }
        });
        if (!findDate) {
          throw new Error(`${this.entityName} not found`);
        }
        const newData = await this.prismaInstance.update({
          where: { id: paramsId },
          data
        });
        return newData;
      }
    } catch (error) {
      console.error(`Error in updating ${this.entityName}:`, error);
      throw new Error(`Failed to update ${this.entityName}`);
    }
  }
  async delete(paramsId, decodeId) {
    try {
      if (this.entityName === "record") {
        const findDate = await prismaClient.record.delete({
          where: { id: paramsId }
        });
        return findDate;
      } else {
        const newData = await this.prismaInstance.findUnique({
          where: { user_id: decodeId, id: paramsId }
        });
        if (!newData) {
          throw new Error(`${this.entityName} not found`);
        }
        const findDate = await this.prismaInstance.delete({
          where: { user_id: decodeId, id: paramsId }
        });
        return findDate;
      }
    } catch (error) {
      console.error(`Error in deleting ${this.entityName}:`, error);
      throw new Error(`Failed to delete ${this.entityName}`);
    }
  }
  async updateManyTitles(currentName, updateName) {
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

// src/route/ApiRouter.ts
var ApiRouter = class {
  constructor(router, endpoint, schemaInstance, authorization) {
    this.router = router;
    this.endpoint = endpoint;
    this.schemaInstance = schemaInstance;
    this.authorization = authorization;
    this.apiService = new ApiService(this.endpoint, this.schemaInstance);
    this.apiController = new ApiController_default(this.apiService);
    if (authorization) {
      this.PrivateRoutes();
    } else {
      this.publicRoutes();
    }
  }
  publicRoutes() {
    this.router.post(
      `/${this.endpoint}`,
      (req, res) => this.apiController.create(req, res)
    );
    this.router.get(
      `/${this.endpoint}`,
      (req, res) => this.apiController.read(req, res)
    );
    this.router.put(
      `/${this.endpoint}/:id`,
      (req, res) => this.apiController.update(req, res)
    );
    this.router.delete(
      `/${this.endpoint}/:id`,
      (req, res) => this.apiController.delete(req, res)
    );
  }
  PrivateRoutes() {
    this.router.post(
      `/${this.endpoint}`,
      this.authorization,
      (req, res) => this.apiController.create(req, res)
    );
    this.router.get(
      `/${this.endpoint}`,
      this.authorization,
      (req, res) => this.apiController.read(req, res)
    );
    this.router.put(
      `/${this.endpoint}/:id`,
      this.authorization,
      (req, res) => this.apiController.update(req, res)
    );
    this.router.delete(
      `/${this.endpoint}/:id`,
      this.authorization,
      (req, res) => this.apiController.delete(req, res)
    );
    this.router.put(
      "/records/update",
      this.authorization,
      (req, res) => this.apiController.updateManyTitles(req, res)
    );
    this.router.get(
      `/record/:id`,
      this.authorization,
      (req, res) => this.apiController.read(req, res)
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiRouter
});
