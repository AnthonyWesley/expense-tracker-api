import cors from "cors";
import dotenv from "dotenv";
import router from "../src/route/expensesRoutes";
dotenv.config();

import express from "express";

const server = express();
const port = 3001;

server.use(cors({ origin: "*" }));
server.use(express.json());

server.use(router);
// console.log("DATABASE_URL:", process.env.DATABASE_URL);

server.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
