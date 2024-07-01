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

// src/services/UserService.ts
var UserService_exports = {};
__export(UserService_exports, {
  userService: () => userService
});
module.exports = __toCommonJS(UserService_exports);
var import_bcryptjs2 = __toESM(require("bcryptjs"));

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

// src/services/UserService.ts
var import_ulid = require("ulid");
var UserService = class {
  async register({ name, email, password }) {
    console.log(name, email, password);
    try {
      const user = await prismaClient.user.findUnique({ where: { email } });
      console.log("User findUnique result:", user);
      if (!user) {
        const createUser = await prismaClient.user.create({
          data: { id: (0, import_ulid.ulid)(), name: name || "", email, password }
        });
        console.log("User created:", createUser);
        const category = await prismaClient.category.create({
          data: {
            id: (0, import_ulid.ulid)(),
            name: "MERCADO",
            color: "red",
            expense: true,
            user_id: createUser.id
          }
        });
        console.log("Category created:", category);
        const account = await prismaClient.account.create({
          data: {
            id: (0, import_ulid.ulid)(),
            name: "CONTA PRINCIPAL",
            number: "012345-6",
            branch: "012",
            type: "Corrente",
            user_id: createUser.id
          }
        });
        console.log("Account created:", account);
        return createUser;
      }
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error("Failed to create user");
    }
  }
  async login({ email, password }) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { email }
        // include: {
        //   accounts: {
        //     include: {
        //       records: true,
        //     },
        //   },
        // },
      });
      if (user) {
        const decryptedPassword = await import_bcryptjs2.default.compare(password, user.password);
        if (decryptedPassword) {
          return user;
        }
      }
    } catch (error) {
      console.error("Error in user login:", error);
      throw new Error("Failed to login user");
    }
  }
};
var userService = new UserService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userService
});
