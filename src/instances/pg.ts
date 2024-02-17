import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let { SB_PASSWORD, SB_HOST, SB_USER, SB_PORT, SB_DB } = process.env;

export const sequelize = new Sequelize(
  `postgres://postgres.ppojpgqwcqigxlgcoigl:${SB_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  {
    host: "aws-0-sa-east-1.pooler.supabase.com",
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT as string),
  }
);

// let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// export const sequelize = new Sequelize(
//   `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`,
//   {
//     host: "0.0.0.0",
//     dialect: "postgres",
//     port: parseInt(process.env.PG_PORT as string),
//   }
// );
