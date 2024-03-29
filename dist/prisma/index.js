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

// src/prisma/index.ts
var prisma_exports = {};
__export(prisma_exports, {
  prismaClient: () => prismaClient
});
module.exports = __toCommonJS(prisma_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  prismaClient
});
