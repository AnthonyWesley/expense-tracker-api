import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let { SBPASSWORD, SBHOST } = process.env;

export const sequelize = new Sequelize(
  `postgres://postgres.ppojpgqwcqigxlgcoigl:awnnawl777x7@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  {
    host: "0.0.0.0",
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
