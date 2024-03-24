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

// src/controllers/CategoryController.ts
var CategoryController_exports = {};
__export(CategoryController_exports, {
  categoryController: () => categoryController
});
module.exports = __toCommonJS(CategoryController_exports);

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

// src/models/User.ts
var import_sequelize2 = require("sequelize");

// src/instances/pg.ts
var import_sequelize = require("sequelize");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
var sequelize = new import_sequelize.Sequelize(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
  {
    host: "0.0.0.0",
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT)
  }
);

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

// src/models/Category.ts
var import_sequelize3 = require("sequelize");
var Category = sequelize.define(
  "Category",
  {
    id: {
      type: import_sequelize3.DataTypes.UUID,
      defaultValue: import_sequelize3.UUIDV4,
      primaryKey: true
    },
    title: {
      type: import_sequelize3.DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: import_sequelize3.DataTypes.STRING,
      allowNull: false
    },
    expense: {
      type: import_sequelize3.DataTypes.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      type: import_sequelize3.DataTypes.DATE,
      allowNull: false,
      defaultValue: import_sequelize3.DataTypes.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: import_sequelize3.DataTypes.DATE,
      allowNull: false,
      defaultValue: import_sequelize3.DataTypes.NOW,
      field: "updated_at"
    }
  },
  {
    tableName: "categories"
  }
);
User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

// src/services/CategoryService.ts
var CategoryService = class {
  async create(decodeId, { title, color, expense }) {
    try {
      const user = await User.findOne({
        where: { id: decodeId }
      });
      if (!user) {
        throw new Error("User not found for category creation");
      }
      const newCategory = await Category.create({
        title,
        color,
        expense,
        userId: decodeId
      });
      return newCategory;
    } catch (error) {
      console.error("Error in category creation:", error);
      throw new Error("Failed to create category");
    }
  }
  async read(decodeId) {
    try {
      if (decodeId == null) {
        throw new Error("Invalid user ID");
      }
      const categories = await Category.findAll({
        where: { userId: decodeId }
      });
      return categories;
    } catch (error) {
      console.error("Error in reading categories:", error);
      throw new Error("Failed to read categories");
    }
  }
  async update(paramsId, decodeId, { title, color, expense }) {
    try {
      const existingCategory = await Category.findOne({
        where: { userId: decodeId, id: paramsId }
      });
      if (!existingCategory) {
        throw new Error("Category not found");
      }
      const updatedCategory = await existingCategory.update({
        title,
        color,
        expense
      });
      return updatedCategory;
    } catch (error) {
      console.error("Error in updating category:", error);
      throw new Error("Failed to update category");
    }
  }
  async delete(paramsId, decodeId) {
    try {
      const existingCategory = await Category.findOne({
        where: { userId: decodeId, id: paramsId }
      });
      if (!existingCategory) {
        throw new Error("Category not found");
      }
      const deletedCategoriesCount = await Category.destroy({
        where: { userId: decodeId, id: paramsId }
      });
      return deletedCategoriesCount;
    } catch (error) {
      console.error("Error in deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
};
var categoryService = new CategoryService();

// src/controllers/CategoryController.ts
var CategoryController = class {
  async create(req, res) {
    try {
      const { title, color, expense } = req.body;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const categories = await categoryService.create(decode.userId, {
          title: title.toUpperCase(),
          color,
          expense
        });
        return res.status(201).json({ success: true, categories });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  async read(req, res) {
    try {
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const categories = await categoryService.read(decode.userId);
        return res.status(201).json({ success: true, categories });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async update(req, res) {
    try {
      const { title, color, expense } = req.body;
      const { id } = req.params;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const categories = await categoryService.update(id, decode.userId, {
          title: title.toUpperCase(),
          color,
          expense
        });
        return res.status(201).json({ success: true, categories });
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization;
      const decode = decodeToken(token);
      if (decode && decode.userId) {
        const deletedCategory = await categoryService.delete(id, decode.userId);
        if (deletedCategory) {
          return res.status(200).json({ success: true, message: `Record ID - ${id} - DELETED` });
        } else {
          return res.status(404).json({ error: "Not Found", message: "Category doesn't exist" });
        }
      } else {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
var categoryController = new CategoryController();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  categoryController
});
