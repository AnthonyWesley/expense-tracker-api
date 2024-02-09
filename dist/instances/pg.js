"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
exports.sequelize = new sequelize_1.Sequelize(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`, {
    host: "0.0.0.0",
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT),
});
// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
// dotenv.config();
// export const sequelize = new Sequelize(
//   process.env.PG_DB as string,
//   process.env.PG_USER as string,
//   process.env.PG_PASSWORD as string,
//   {
//     dialect: "postgres",
//     port: parseInt(process.env.PG_PORT as string),
//   }
// );
//# sourceMappingURL=pg.js.map