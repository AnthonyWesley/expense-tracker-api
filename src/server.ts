import express from "express";
import router from "./route/expensesRoutes";
import cors from "cors";

const server = express();

// server.use(cors());
server.use(cors({ origin: "*" }));
server.use(express.json());

server.use(router);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
