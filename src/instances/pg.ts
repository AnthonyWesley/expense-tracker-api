import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sequelize = new Sequelize(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
  {
    host: "0.0.0.0",
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT as string),
  }
);
