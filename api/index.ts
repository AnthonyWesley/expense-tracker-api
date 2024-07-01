import express from "express";

import cors from "cors";
import router from "../src/route/expensesRoutes";

const server = express();

// server.use(cors());
server.use(cors({ origin: "*" }));
server.use(express.json());

server.use(router);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
