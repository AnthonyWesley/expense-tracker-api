"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/interfaces/PrismaRepository.ts
var PrismaRepository_exports = {};
__export(PrismaRepository_exports, {
  Repository: () => Repository
});
module.exports = __toCommonJS(PrismaRepository_exports);
var Repository = class {
  constructor(_schema) {
    _schema = this._schema;
  }
  async create(userId, data) {
    return this._schema.create({
      data: { ...data, userId }
    });
  }
  async read(userId) {
    return this._schema.findMany({
      where: { userId }
    });
  }
  async update(dataId, userId, data) {
    return this._schema.update({
      where: { id: dataId, userId },
      data: { ...data }
    });
  }
  async delete(dataId, userId) {
    return this._schema.delete({
      where: { id: dataId, userId }
    });
  }
  async updateMany(currentName, updateName) {
    return this._schema.updateMany({
      where: { category: currentName.toUpperCase().trim() },
      data: { category: updateName.toUpperCase().trim() }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Repository
});
