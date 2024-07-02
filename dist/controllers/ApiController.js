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

// src/controllers/ApiController.ts
var ApiController_exports = {};
__export(ApiController_exports, {
  default: () => ApiController_default
});
module.exports = __toCommonJS(ApiController_exports);

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
