import cors from "cors";
import dotenv from "dotenv";
import router from "../src/route/expensesRoutes";

import express from "express";
dotenv.config();

const server = express();

// server.use(cors());
server.use(cors({ origin: "*" }));
server.use(express.json());

server.use(router);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
