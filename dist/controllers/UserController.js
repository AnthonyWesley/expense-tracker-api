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

// src/controllers/UserController.ts
var UserController_exports = {};
__export(UserController_exports, {
  userController: () => userController
});
module.exports = __toCommonJS(UserController_exports);

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
var generateToken = (id, exp) => {
  const secretKey = process.env.SECRET_KEY;
  try {
    const token = import_jsonwebtoken.default.sign({ userId: id }, secretKey, {
      expiresIn: exp ? exp : "1h"
    });
    return token;
  } catch (error) {
    return null;
  }
};

// src/models/User.ts
var import_sequelize2 = require("sequelize");

// src/instances/pg.ts
var import_sequelize = require("sequelize");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var sequelize = new import_sequelize.Sequelize("postgres", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres"
});

// src/models/User.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var User = sequelize.define(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: import_sequelize2.DataTypes.INTEGER
    },
    email: {
      type: import_sequelize2.DataTypes.STRING,
      unique: true
    },
    password: {
      type: import_sequelize2.DataTypes.STRING
    },
    name: {
      type: import_sequelize2.DataTypes.STRING
    },
    createdAt: {
      type: import_sequelize2.DataTypes.DATE,
      allowNull: false,
      defaultValue: import_sequelize2.DataTypes.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: import_sequelize2.DataTypes.DATE,
      allowNull: false,
      defaultValue: import_sequelize2.DataTypes.NOW,
      field: "updated_at"
    }
  },
  {
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        const hashedPassword = await import_bcryptjs.default.hash(user.password, 10);
        user.password = hashedPassword;
      }
    }
  }
);

// src/services/UserService.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var UserService = class {
  async register({ name, email, password }) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const createUser = await User.create({ name, email, password });
        return createUser;
      }
    } catch (error) {
      console.error("Error in user creation:", error);
      throw new Error("Failed to create user");
    }
  }
  async login({ email, password }) {
    try {
      const user = await User.findOne({ where: { email } });
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

// src/controllers/UserController.ts
var UserController = class {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Missing Data. Please provide all required information."
        });
      }
      const createUser = await userService.register({ name, email, password });
      if (createUser) {
        return res.status(201).json({
          success: true,
          message: "User created successfully",
          data: { email }
        });
      } else {
        return res.status(409).json({ error: "Conflict", message: "Email already exists" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.login({ email, password });
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password"
        });
      }
      const accessToken = generateToken(user.id);
      const refreshToken = generateToken(user.id, "7d");
      if (accessToken) {
        res.status(200).json({
          success: true,
          user,
          token: { accessToken, refreshToken }
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async refreshToken(req, res) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    const decode = decodeToken(refreshToken);
    const accessToken = generateToken(decode.userId);
    return res.status(200).json({ success: true, token: { accessToken, refreshToken } });
  }
};
var userController = new UserController();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userController
});
